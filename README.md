# 🎵 Mashup Studio - AI-Powered Music Mashup Creator

A sophisticated web service that creates professional music mashups using AI-powered chorus detection and intelligent audio processing.

## ✨ Key Features & USPs

### 🎯 **AI-Powered Chorus Detection**

Unlike traditional mashup tools that simply cut from the start of songs, our system:

- Uses **librosa** for advanced audio analysis
- Detects beat patterns and tempo
- Identifies the most energetic sections (usually the chorus)
- Extracts the **best parts** of each song, not just the beginning

### 🚀 **Advanced Audio Processing**

- **Spectral Analysis**: Analyzes frequency content to find high-energy segments
- **Smart Normalization**: Ensures consistent volume across all tracks
- **Smooth Transitions**: Automatic fade-in/fade-out for professional results
- **High-Quality Output**: 192kbps MP3 with optimized audio settings

### 🎨 **Beautiful Modern UI**

- Stunning gradient design with Tailwind CSS
- Real-time progress tracking
- Responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Professional color scheme

### 📧 **Email Delivery System**

- Automated email with HTML formatting
- ZIP file attachment with mashup
- Professional email templates
- Job tracking and status updates

### ⚡ **Performance Features**

- Asynchronous processing
- Background job handling
- Real-time status updates
- Efficient file management
- Automatic cleanup

---

## 🛠️ Tech Stack

### Backend

- **Flask** - Web framework
- **yt-dlp** - YouTube video downloading
- **pydub** - Audio manipulation
- **librosa** - AI-powered audio analysis
- **numpy/scipy** - Scientific computing

### Frontend

- **React** - UI framework
- **Tailwind CSS** - Styling
- **Modern JavaScript** - ES6+

---

## 📦 Installation & Setup

### Prerequisites

- Python 3.8+
- Node.js 16+
- ffmpeg (required for audio processing)

### Install ffmpeg

**Mac:**

```bash
brew install ffmpeg
```

**Ubuntu/Debian:**

```bash
sudo apt update
sudo apt install ffmpeg
```

**Windows:**
Download from [ffmpeg.org](https://ffmpeg.org/download.html)

### Backend Setup

1. **Navigate to backend directory:**

```bash
cd mashup-service/backend
```

2. **Create virtual environment:**

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**

```bash
pip install -r requirements.txt
```

4. **Configure email (IMPORTANT):**
   Edit `app.py` and update the EmailConfig class:

```python
class EmailConfig:
    SMTP_SERVER = "smtp.gmail.com"
    SMTP_PORT = 587
    SENDER_EMAIL = "your-email@gmail.com"  # Your Gmail
    SENDER_PASSWORD = "your-app-password"  # Gmail App Password
```

**Getting Gmail App Password:**

1. Go to Google Account settings
2. Security → 2-Step Verification → App passwords
3. Generate new app password
4. Use this password in the code

5. **Run the backend:**

```bash
python app.py
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**

```bash
cd mashup-service/frontend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Start development server:**

```bash
npm start
```

Frontend will run on `http://localhost:3000`

---

## 🎮 Usage

### Web Interface

1. **Open browser** to `http://localhost:3000`
2. **Fill in the form:**
   - Singer/Artist name
   - Number of videos (10-50)
   - Duration per clip (20-60 seconds)
   - Your email address
   - Toggle AI chorus detection (recommended: ON)
3. **Click "Create My Mashup"**
4. **Wait** for processing (usually 5-10 minutes)
5. **Check your email** for the mashup ZIP file

### Command Line Interface

For the command-line version (Program 1):

```bash
cd backend
python 102303845.py "Arijit Singh" 20 30 output.mp3
```

**Syntax:**

```
python <rollnumber>.py <SingerName> <NumberOfVideos> <Duration> <OutputFile>
```

**Example:**

```bash
python 102303845.py "Sharry Maan" 20 20 102303845-output.mp3
```

---

## 🚀 Deployment

### Deploy Frontend to Vercel

1. **Install Vercel CLI:**

```bash
npm install -g vercel
```

2. **Navigate to frontend:**

```bash
cd frontend
```

3. **Deploy:**

```bash
vercel
```

4. **Set environment variable:**
   In Vercel dashboard, add:

```
REACT_APP_API_URL=https://your-backend-url.com
```

### Deploy Backend Options

#### Option 1: Render.com (Recommended)

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repo
4. Set build command: `pip install -r requirements.txt`
5. Set start command: `gunicorn app:app`
6. Add environment variables for email

#### Option 2: Railway.app

1. Connect GitHub repo
2. Auto-detects Python
3. Add environment variables
4. Deploy

#### Option 3: PythonAnywhere

1. Upload code
2. Create virtual environment
3. Install dependencies
4. Configure WSGI file

---

## 🌟 Project Highlights for Resume

### Technical Skills Demonstrated

- ✅ **AI/ML Integration** - librosa for audio analysis
- ✅ **Full-Stack Development** - React + Flask
- ✅ **Asynchronous Processing** - Background jobs with threading
- ✅ **API Design** - RESTful endpoints
- ✅ **Cloud Deployment** - Vercel + backend hosting
- ✅ **Email Integration** - SMTP with HTML templates
- ✅ **Modern UI/UX** - Tailwind CSS, responsive design
- ✅ **Audio Processing** - pydub, ffmpeg integration
- ✅ **Error Handling** - Comprehensive validation
- ✅ **File Management** - ZIP creation, cleanup

### Unique Selling Points

1. **AI-Powered Intelligence**: Not just cutting from start - finds the BEST parts
2. **Professional Quality**: Normalized audio, smooth transitions
3. **Beautiful Interface**: Modern, gradient design with animations
4. **Email Delivery**: Automated professional email system
5. **Real-time Updates**: Live progress tracking
6. **Scalable Architecture**: Background processing, job queue

---

## 📁 Project Structure

```
mashup-service/
├── backend/
│   ├── app.py                    # Main Flask application
│   ├── mashup_processor.py       # AI-powered audio processing
│   ├── 102303845.py             # Command-line version
│   ├── requirements.txt         # Python dependencies
│   ├── temp_files/              # Temporary processing files
│   └── outputs/                 # Generated mashups
├── frontend/
│   ├── src/
│   │   ├── App.js              # Main React component
│   │   ├── App.css             # Tailwind styles
│   │   └── index.js            # React entry point
│   ├── public/
│   │   └── index.html          # HTML template
│   ├── package.json            # Node dependencies
│   ├── tailwind.config.js      # Tailwind configuration
│   └── postcss.config.js       # PostCSS configuration
└── README.md                    # This file
```

---

## 🎯 How It Works

### Intelligent Audio Extraction Process

1. **Video Download**
   - Searches YouTube for specified artist
   - Downloads N videos using yt-dlp
   - Converts to MP3 format

2. **AI Analysis** (When intelligent extraction is enabled)
   - Loads audio with librosa
   - Calculates spectral features
   - Detects beat patterns and tempo
   - Identifies high-energy segments
   - Locates the most repetitive parts (chorus)

3. **Smart Extraction**
   - Extracts the identified chorus section
   - NOT just the first Y seconds
   - Finds the BEST part of each song

4. **Audio Processing**
   - Normalizes volume levels
   - Adds fade-in/fade-out
   - Ensures consistent quality

5. **Merging**
   - Combines all segments
   - Creates final mashup
   - Exports as high-quality MP3

6. **Delivery**
   - Creates ZIP file
   - Sends via email
   - Cleanup temporary files

---

## 🔧 Configuration Options

### Backend (app.py)

```python
# Email Configuration
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = "your-email@gmail.com"
SENDER_PASSWORD = "your-app-password"

# File Paths
UPLOAD_FOLDER = 'temp_files'
OUTPUT_FOLDER = 'outputs'
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000
```

---

## 🐛 Troubleshooting

### Common Issues

**1. ffmpeg not found**

```bash
# Install ffmpeg first (see installation section)
```

**2. Email not sending**

```bash
# Check Gmail app password is correct
# Ensure 2-factor authentication is enabled
# Verify SMTP settings
```

**3. Downloads failing**

```bash
# Update yt-dlp:
pip install --upgrade yt-dlp
```

**4. Low audio quality**

```bash
# Check ffmpeg is properly installed
# Verify bitrate settings in code (192k default)
```

**5. CORS errors**

```bash
# Ensure Flask-CORS is installed
# Check API_URL in frontend matches backend
```

---

## 📊 Performance Metrics

- **Processing Time**: 5-10 minutes for 20 videos
- **Output Quality**: 192kbps MP3
- **File Size**: ~50-100MB for 20 videos × 30 seconds
- **Supported Formats**: MP3 output
- **Max Videos**: 50 (configurable)

---

## 🎓 Learning Outcomes

This project demonstrates:

- Full-stack web development
- AI/ML integration in real applications
- Audio signal processing
- Asynchronous programming
- REST API design
- Modern frontend development
- Cloud deployment
- Email automation
- Error handling & validation

---

## 📝 License

This project is for educational purposes.

---

## 👨‍💻 Author
Pooja Bisht
Created as a demonstration of advanced full-stack development with AI integration.

**Key Technologies**: Python, Flask, React, Tailwind CSS, librosa, yt-dlp, pydub

---

## 🙏 Acknowledgments

- **librosa** for audio analysis
- **yt-dlp** for YouTube integration
- **pydub** for audio processing
- **Tailwind CSS** for beautiful styling
- **React** for modern UI

---

## 📞 Support

For issues or questions:

1. Check the troubleshooting section
2. Verify all dependencies are installed
3. Ensure ffmpeg is properly configured
4. Check email configuration

---

**Made with ❤️**

Featuring intelligent chorus detection, professional audio quality, and beautiful modern design.
