from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import sys
import threading
import uuid
from datetime import datetime
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email.mime.text import MIMEText
from email import encoders
import zipfile
import shutil
from pathlib import Path

# Import mashup processing
from mashup_processor import MashupProcessor

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'temp_files'
OUTPUT_FOLDER = 'outputs'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# In-memory job tracking
jobs = {}

class EmailConfig:
    """Email configuration - UPDATE THESE WITH YOUR CREDENTIALS"""
    SMTP_SERVER = "smtp.gmail.com"
    SMTP_PORT = 587
    SENDER_EMAIL = "poojabishtdoon@gmail.com" 
    SENDER_PASSWORD = "vmrs qnnz nxyy pjvf"  
def send_email_with_attachment(recipient_email, subject, body, attachment_path, job_id):
    """Send email with attachment"""
    try:
        msg = MIMEMultipart()
        msg['From'] = EmailConfig.SENDER_EMAIL
        msg['To'] = recipient_email
        msg['Subject'] = subject
        
        # Email body
        msg.attach(MIMEText(body, 'html'))
        
        # Attach file
        with open(attachment_path, 'rb') as attachment:
            part = MIMEBase('application', 'zip')
            part.set_payload(attachment.read())
            encoders.encode_base64(part)
            part.add_header('Content-Disposition', f'attachment; filename={os.path.basename(attachment_path)}')
            msg.attach(part)
        
        # Send email
        server = smtplib.SMTP(EmailConfig.SMTP_SERVER, EmailConfig.SMTP_PORT)
        server.starttls()
        server.login(EmailConfig.SENDER_EMAIL, EmailConfig.SENDER_PASSWORD)
        server.send_message(msg)
        server.quit()
        
        jobs[job_id]['status'] = 'completed'
        jobs[job_id]['message'] = 'Email sent successfully!'
        return True
    except Exception as e:
        jobs[job_id]['status'] = 'failed'
        jobs[job_id]['message'] = f'Email error: {str(e)}'
        return False

def process_mashup_task(job_id, singer_name, num_videos, duration, email, use_intelligent_extraction):
    """Background task to process mashup"""
    try:
        jobs[job_id]['status'] = 'processing'
        jobs[job_id]['message'] = 'Downloading videos...'
        
        # Create job folder
        job_folder = os.path.join(UPLOAD_FOLDER, job_id)
        os.makedirs(job_folder, exist_ok=True)
        
        # Initialize processor
        processor = MashupProcessor(job_folder)
        
        # Update progress callback
        def update_progress(message):
            jobs[job_id]['message'] = message
        
        # Process mashup
        output_file = processor.create_mashup(
            singer_name=singer_name,
            num_videos=num_videos,
            duration=duration,
            output_filename=f"{job_id}_mashup.mp3",
            progress_callback=update_progress,
            use_intelligent_extraction=use_intelligent_extraction
        )
        
        if not output_file or not os.path.exists(output_file):
            raise Exception("Failed to create mashup")
        
        # Create ZIP file
        jobs[job_id]['message'] = 'Creating ZIP file...'
        zip_path = os.path.join(OUTPUT_FOLDER, f"{job_id}_mashup.zip")
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            zipf.write(output_file, os.path.basename(output_file))
        
        # Send email
        jobs[job_id]['message'] = 'Sending email...'
        email_body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #6366f1; margin-bottom: 20px;">🎵 Your Mashup is Ready!</h2>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    Hello there! 👋
                </p>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    Your custom mashup for <strong>{singer_name}</strong> has been successfully created!
                </p>
                <div style="background-color: #f8f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #6366f1; margin-top: 0;">Mashup Details:</h3>
                    <ul style="color: #555; line-height: 1.8;">
                        <li>🎤 Artist: {singer_name}</li>
                        <li>📹 Videos processed: {num_videos}</li>
                        <li>⏱️ Duration per clip: {duration} seconds</li>
                        <li>🎼 Processing: {"Intelligent Chorus Extraction" if use_intelligent_extraction else "Standard Extraction"}</li>
                    </ul>
                </div>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                    Your mashup is attached to this email. Enjoy! 🎉
                </p>
                <p style="color: #888; font-size: 14px; margin-top: 30px;">
                    Created with ❤️ by Mashup Studio
                </p>
            </div>
        </body>
        </html>
        """
        
        send_email_with_attachment(
            recipient_email=email,
            subject=f"🎵 Your {singer_name} Mashup is Ready!",
            body=email_body,
            attachment_path=zip_path,
            job_id=job_id
        )
        
        # Cleanup
        shutil.rmtree(job_folder, ignore_errors=True)
        
    except Exception as e:
        jobs[job_id]['status'] = 'failed'
        jobs[job_id]['message'] = str(e)
        print(f"Error processing job {job_id}: {str(e)}")

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

@app.route('/api/create-mashup', methods=['POST'])
def create_mashup():
    """Create mashup endpoint"""
    try:
        data = request.json
        
        # Validate input
        required_fields = ['singerName', 'numVideos', 'duration', 'email']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        singer_name = data['singerName'].strip()
        num_videos = int(data['numVideos'])
        duration = int(data['duration'])
        email = data['email'].strip()
        use_intelligent = data.get('intelligentExtraction', True)
        
        # Validate ranges
        if num_videos < 10:
            return jsonify({'error': 'Number of videos must be at least 10'}), 400
        if num_videos > 50:
            return jsonify({'error': 'Number of videos cannot exceed 50 (processing limit)'}), 400
        if duration < 20:
            return jsonify({'error': 'Duration must be at least 20 seconds'}), 400
        if duration > 60:
            return jsonify({'error': 'Duration cannot exceed 60 seconds'}), 400
        if '@' not in email:
            return jsonify({'error': 'Invalid email address'}), 400
        
        # Create job
        job_id = str(uuid.uuid4())
        jobs[job_id] = {
            'status': 'queued',
            'message': 'Job queued',
            'created_at': datetime.now().isoformat(),
            'singer': singer_name,
            'num_videos': num_videos,
            'duration': duration
        }
        
        # Start background processing
        thread = threading.Thread(
            target=process_mashup_task,
            args=(job_id, singer_name, num_videos, duration, email, use_intelligent)
        )
        thread.daemon = True
        thread.start()
        
        return jsonify({
            'success': True,
            'job_id': job_id,
            'message': 'Mashup creation started! You will receive an email when it\'s ready.'
        })
        
    except ValueError as e:
        return jsonify({'error': 'Invalid input values'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/job-status/<job_id>', methods=['GET'])
def get_job_status(job_id):
    """Get job status"""
    if job_id not in jobs:
        return jsonify({'error': 'Job not found'}), 404
    
    return jsonify(jobs[job_id])

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get service statistics"""
    total_jobs = len(jobs)
    completed = sum(1 for j in jobs.values() if j['status'] == 'completed')
    processing = sum(1 for j in jobs.values() if j['status'] == 'processing')
    failed = sum(1 for j in jobs.values() if j['status'] == 'failed')
    
    return jsonify({
        'total_jobs': total_jobs,
        'completed': completed,
        'processing': processing,
        'failed': failed
    })

if __name__ == '__main__':
    print("🎵 Mashup Studio API Starting...")
    print("=" * 50)
    print(f"Server running on: http://localhost:5000")
    print(f"Health check: http://localhost:5000/api/health")
    print("=" * 50)
    app.run(debug=True, host='0.0.0.0', port=5000)
