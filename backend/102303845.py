#!/usr/bin/env python3
"""
Command Line Mashup Creator
Usage: python <rollnumber>.py <SingerName> <NumberOfVideos> <AudioDuration> <OutputFileName>
Example: python 1015579.py "Sharry Maan" 20 20 1015579-output.mp3
"""

import sys
import os
from mashup_processor import MashupProcessor
import tempfile
import shutil

def print_banner():
    """Print application banner"""
    print("=" * 70)
    print("🎵 MASHUP CREATOR - Command Line Edition")
    print("=" * 70)
    print()

def validate_arguments(args):
    """Validate command line arguments"""
    if len(args) != 5:
        print("❌ Error: Incorrect number of parameters")
        print()
        print("Usage:")
        print("  python <program.py> <SingerName> <NumberOfVideos> <AudioDuration> <OutputFileName>")
        print()
        print("Example:")
        print('  python 1015579.py "Sharry Maan" 20 20 1015579-output.mp3')
        print()
        print("Parameters:")
        print("  SingerName      : Name of the singer (in quotes if contains spaces)")
        print("  NumberOfVideos  : Number of videos to download (must be > 10)")
        print("  AudioDuration   : Duration in seconds for each clip (must be > 20)")
        print("  OutputFileName  : Name of the output file (e.g., output.mp3)")
        print()
        return False
    
    try:
        singer_name = args[1]
        num_videos = int(args[2])
        duration = int(args[3])
        output_file = args[4]
        
        # Validation
        if not singer_name.strip():
            print("❌ Error: Singer name cannot be empty")
            return False
        
        if num_videos <= 10:
            print(f"❌ Error: Number of videos must be greater than 10 (got {num_videos})")
            return False
        
        if duration <= 20:
            print(f"❌ Error: Audio duration must be greater than 20 seconds (got {duration})")
            return False
        
        if not output_file.endswith('.mp3'):
            print("❌ Error: Output file must have .mp3 extension")
            return False
        
        return {
            'singer_name': singer_name,
            'num_videos': num_videos,
            'duration': duration,
            'output_file': output_file
        }
        
    except ValueError as e:
        print(f"❌ Error: Invalid input values - {e}")
        print("NumberOfVideos and AudioDuration must be integers")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def progress_callback(message):
    """Display progress messages"""
    print(f"  {message}")

def main():
    """Main function"""
    print_banner()
    
    # Validate arguments
    params = validate_arguments(sys.argv)
    if not params:
        sys.exit(1)
    
    print(f"Singer Name    : {params['singer_name']}")
    print(f"Videos         : {params['num_videos']}")
    print(f"Duration       : {params['duration']} seconds")
    print(f"Output File    : {params['output_file']}")
    print()
    print("Starting mashup creation...")
    print("-" * 70)
    print()
    
    # Create temporary working directory
    temp_dir = tempfile.mkdtemp(prefix='mashup_')
    
    try:
        # Initialize processor
        processor = MashupProcessor(temp_dir)
        
        # Create mashup
        output_path = processor.create_mashup(
            singer_name=params['singer_name'],
            num_videos=params['num_videos'],
            duration=params['duration'],
            output_filename=params['output_file'],
            progress_callback=progress_callback,
            use_intelligent_extraction=True  # Use intelligent extraction by default
        )
        
        # Move output file to current directory
        final_output = os.path.join(os.getcwd(), params['output_file'])
        shutil.move(output_path, final_output)
        
        print()
        print("-" * 70)
        print(f"✅ SUCCESS! Mashup created: {final_output}")
        print(f"📊 File size: {os.path.getsize(final_output) / (1024*1024):.2f} MB")
        print("=" * 70)
        
    except Exception as e:
        print()
        print("-" * 70)
        print(f"❌ FAILED: {str(e)}")
        print("=" * 70)
        sys.exit(1)
        
    finally:
        # Cleanup temporary directory
        try:
            shutil.rmtree(temp_dir)
        except:
            pass

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n❌ Operation cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ Unexpected error: {str(e)}")
        sys.exit(1)
