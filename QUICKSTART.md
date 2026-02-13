# 🚀 Quick Start Guide

## ⚡ Get Running in 5 Minutes

### Step 1: Install ffmpeg

```bash
# Mac
brew install ffmpeg

# Ubuntu/Debian
sudo apt install ffmpeg

# Windows - Download from https://ffmpeg.org
```

### Step 2: Backend Setup

```bash
cd mashup-service/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure email in app.py (line 24-27)
# IMPORTANT: Add your Gmail and App Password

# Run backend
python app.py
```

Backend runs on `http://localhost:5000`

### Step 3: Frontend Setup

```bash
cd mashup-service/frontend

# Install dependencies
npm install

# Run frontend
npm start
```

Frontend runs on `http://localhost:3000`

### Step 4: Test It Out!

1. Open `http://localhost:3000`
2. Enter:
   - Singer: "Arijit Singh"
   - Videos: 20
   - Duration: 30 seconds
   - Your email
3. Click "Create My Mashup"
4. Check email in ~10 minutes

---

## 🎯 Command Line Version

```bash
cd backend
python 102303845.py "Sharry Maan" 20 30 output.mp3
```

---

## ⚙️ Email Configuration (CRITICAL)

### Get Gmail App Password:

1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Go to "App passwords"
4. Generate password for "Mail"
5. Copy the 16-character password

### Update app.py:

```python
class EmailConfig:
    SMTP_SERVER = "smtp.gmail.com"
    SMTP_PORT = 587
    SENDER_EMAIL = "youremail@gmail.com"     # ← Change this
    SENDER_PASSWORD = "your-app-password"     # ← Change this
```

---

## 🐛 Common Issues

### "ffmpeg not found"

→ Install ffmpeg (see Step 1)

### "Email failed"

→ Check Gmail app password is correct
→ Make sure 2FA is enabled on Gmail

### "No module named 'librosa'"

→ Run `pip install -r requirements.txt` again

### "Port 5000 already in use"

→ Change port in app.py (last line)

---

## ✅ Success!

Once both servers are running:

- Backend: ✅ http://localhost:5000
- Frontend: ✅ http://localhost:3000

You're ready to create mashups! 🎵
