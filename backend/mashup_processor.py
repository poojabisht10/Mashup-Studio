import os
import subprocess
from pydub import AudioSegment
from pydub.effects import normalize
import librosa
import numpy as np
from yt_dlp import YoutubeDL
import tempfile
import shutil

class MashupProcessor:
    def __init__(self, working_dir):
        self.working_dir = working_dir
        self.downloads_dir = os.path.join(working_dir, 'downloads')
        self.audio_dir = os.path.join(working_dir, 'audio')
        self.segments_dir = os.path.join(working_dir, 'segments')
        
        os.makedirs(self.downloads_dir, exist_ok=True)
        os.makedirs(self.audio_dir, exist_ok=True)
        os.makedirs(self.segments_dir, exist_ok=True)
    
    def is_valid_audio(self, audio_path):
        """Check if audio file is valid and not silent"""
        try:
            audio = AudioSegment.from_mp3(audio_path)
            
            # Check duration (at least 30 seconds)
            if len(audio) < 30000:
                return False
            
            # Check if it's not silent (RMS > threshold)
            if audio.rms < 100:
                return False
            
            return True
        except Exception as e:
            print(f"Invalid audio file {audio_path}: {e}")
            return False
    
    def download_videos(self, singer_name, num_videos, progress_callback=None):
        """Download videos from YouTube with better error handling"""
        if progress_callback:
            progress_callback(f"🔍 Searching for {singer_name} videos...")
        
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': os.path.join(self.downloads_dir, '%(id)s.%(ext)s'),
            'quiet': False,
            'no_warnings': False,
            'ignoreerrors': True,
            'extract_flat': False,
            'nocheckcertificate': True,
            'geo_bypass': True,
            'age_limit': None,
            'extractor_args': {'youtube': {'player_client': ['android', 'web']}},
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
        }
        
        search_query = f"{singer_name} official audio"
        
        try:
            valid_files = []
            with YoutubeDL(ydl_opts) as ydl:
                if progress_callback:
                    progress_callback(f"⬇️ Searching and downloading {num_videos} videos...")
                
                # Try to get more results to account for failures
                search_results = ydl.extract_info(f"ytsearch{num_videos + 10}:{search_query}", download=False)
                
                if not search_results or 'entries' not in search_results:
                    raise Exception("No search results found")
                
                # Download and validate each video
                downloaded = 0
                attempts = 0
                
                for entry in search_results['entries']:
                    if downloaded >= num_videos:
                        break
                    
                    if not entry or attempts >= num_videos + 10:
                        continue
                    
                    attempts += 1
                    
                    try:
                        if progress_callback:
                            progress_callback(f"⬇️ Downloading {downloaded + 1}/{num_videos}... (attempt {attempts})")
                        
                        # Download
                        ydl.download([entry['webpage_url']])
                        
                        # Find the downloaded file
                        video_id = entry.get('id', '')
                        potential_file = os.path.join(self.downloads_dir, f"{video_id}.mp3")
                        
                        # Wait a bit for file to be written
                        import time
                        time.sleep(1)
                        
                        # Validate the downloaded file
                        if os.path.exists(potential_file) and self.is_valid_audio(potential_file):
                            valid_files.append(potential_file)
                            downloaded += 1
                            if progress_callback:
                                progress_callback(f"✅ Valid audio {downloaded}/{num_videos}")
                        else:
                            if progress_callback:
                                progress_callback(f"⚠️ Skipping invalid audio")
                            
                    except Exception as e:
                        print(f"Failed to download/validate video: {e}")
                        continue
                
                if len(valid_files) == 0:
                    raise Exception("Could not download any valid audio files")
            
            if progress_callback:
                progress_callback(f"✅ Downloaded {len(valid_files)} valid audio files")
            
            return valid_files
            
        except Exception as e:
            raise Exception(f"Download failed: {str(e)}")
    
    def detect_chorus(self, audio_path, duration_seconds):
        """Intelligent chorus detection with better fallback"""
        try:
            # Load audio
            y, sr = librosa.load(audio_path, sr=22050, duration=180)  # Only load first 3 minutes
            
            # Calculate spectral features for energy
            spectral_centroids = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
            rms = librosa.feature.rms(y=y)[0]
            
            # Combine energy and RMS for better detection
            combined_energy = (spectral_centroids / spectral_centroids.max() + 
                             rms / rms.max()) / 2
            
            # Find segment with highest energy (usually chorus)
            hop_length = 512
            frame_duration = hop_length / sr
            target_frames = int(duration_seconds / frame_duration)
            
            # Sliding window to find most energetic segment
            max_energy = 0
            best_start_frame = 0
            
            window_size = min(len(combined_energy) - target_frames, len(combined_energy))
            
            for i in range(window_size):
                segment_energy = np.mean(combined_energy[i:i+target_frames])
                if segment_energy > max_energy:
                    max_energy = segment_energy
                    best_start_frame = i
            
            # Convert frame to time
            start_time = best_start_frame * frame_duration
            
            # Make sure we don't start too late
            audio_duration = librosa.get_duration(y=y, sr=sr)
            if start_time + duration_seconds > audio_duration:
                start_time = max(0, audio_duration - duration_seconds - 5)  # Leave 5s buffer
            
            # Don't start too early (skip intro)
            if start_time < 20:
                start_time = 20
            
            return start_time * 1000  # Convert to milliseconds
            
        except Exception as e:
            print(f"Chorus detection failed, using smart fallback: {e}")
            # Better fallback: use section around 40% mark (common chorus position)
            try:
                audio = AudioSegment.from_mp3(audio_path)
                duration_ms = duration_seconds * 1000
                audio_length = len(audio)
                
                # Start at 40% of song (common chorus position)
                start_time = int(audio_length * 0.4)
                
                # Make sure we have enough audio
                if start_time + duration_ms > audio_length:
                    start_time = max(0, audio_length - duration_ms - 5000)
                
                # Don't start too early
                if start_time < 20000:
                    start_time = 20000
                
                return start_time
            except:
                return 20000  # Default to 20 seconds if all fails
    
    def extract_segment(self, audio_path, duration_seconds, use_intelligent=True):
        """Extract audio segment with validation"""
        try:
            audio = AudioSegment.from_mp3(audio_path)
            duration_ms = duration_seconds * 1000
            
            # Check if audio is long enough
            if len(audio) < duration_ms + 20000:  # Need at least duration + 20s
                print(f"Audio too short: {len(audio)}ms")
                return None
            
            if use_intelligent:
                # Use intelligent chorus detection
                start_time = self.detect_chorus(audio_path, duration_seconds)
            else:
                # Skip intro, take from 20-30s mark
                start_time = 20000
            
            # Extract segment
            end_time = start_time + duration_ms
            
            # Make sure we don't exceed audio length
            if end_time > len(audio):
                start_time = max(20000, len(audio) - duration_ms - 5000)
                end_time = start_time + duration_ms
            
            segment = audio[start_time:end_time]
            
            # Validate segment is not silent
            if segment.rms < 100:
                print(f"Segment too quiet, skipping")
                return None
            
            # Normalize volume
            segment = normalize(segment)
            
            # Add crossfade-friendly fades (longer for smoother transitions)
            segment = segment.fade_in(1000).fade_out(1000)
            
            return segment
            
        except Exception as e:
            print(f"Error extracting segment from {audio_path}: {e}")
            return None
    
    def merge_audio_segments(self, segments, output_path, progress_callback=None):
        """Merge audio segments with crossfade for smooth transitions"""
        if progress_callback:
            progress_callback(f"🎼 Merging {len(segments)} segments with crossfade...")
        
        if len(segments) == 0:
            raise Exception("No segments to merge")
        
        # Start with first segment
        mashup = segments[0]
        
        # Add remaining segments with crossfade
        for i, segment in enumerate(segments[1:], 1):
            if progress_callback and i % 3 == 0:
                progress_callback(f"🎼 Merging... {i}/{len(segments)-1}")
            
            # Crossfade between segments (500ms overlap)
            mashup = mashup.append(segment, crossfade=500)
        
        # Final normalization
        mashup = normalize(mashup)
        
        # Export with high quality
        if progress_callback:
            progress_callback("💾 Saving final mashup...")
        
        mashup.export(output_path, format='mp3', bitrate='192k', parameters=["-q:a", "0"])
        
        if progress_callback:
            progress_callback(f"✅ Mashup created: {os.path.basename(output_path)}")
        
        return output_path
    
    def create_mashup(self, singer_name, num_videos, duration, output_filename, 
                     progress_callback=None, use_intelligent_extraction=True):
        """Main function to create mashup with quality validation"""
        try:
            # Step 1: Download videos
            audio_files = self.download_videos(singer_name, num_videos, progress_callback)
            
            if len(audio_files) < 5:
                raise Exception(f"Not enough valid audio files downloaded (got {len(audio_files)}, need at least 5)")
            
            # Step 2: Extract segments
            if progress_callback:
                progress_callback(f"🎵 Extracting {'intelligent' if use_intelligent_extraction else 'standard'} segments...")
            
            segments = []
            for i, audio_file in enumerate(audio_files, 1):
                if progress_callback:
                    progress_callback(f"🎵 Processing audio {i}/{len(audio_files)}...")
                
                try:
                    segment = self.extract_segment(audio_file, duration, use_intelligent_extraction)
                    if segment is not None:  # Only add valid segments
                        segments.append(segment)
                        if progress_callback:
                            progress_callback(f"✅ Valid segment {len(segments)}")
                except Exception as e:
                    print(f"Error processing {audio_file}: {e}")
                    continue
            
            if len(segments) < 5:
                raise Exception(f"Not enough valid segments extracted (got {len(segments)}, need at least 5)")
            
            if progress_callback:
                progress_callback(f"✅ Extracted {len(segments)} high-quality segments")
            
            # Step 3: Merge segments
            output_path = os.path.join(self.working_dir, output_filename)
            self.merge_audio_segments(segments, output_path, progress_callback)
            
            return output_path
            
        except Exception as e:
            raise Exception(f"Mashup creation failed: {str(e)}")