#!/bin/bash

echo "======================================================"
echo "🎵 MASHUP STUDIO - Automated Setup"
echo "======================================================"
echo ""

# Check if ffmpeg is installed
echo "Checking for ffmpeg..."
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ ffmpeg not found!"
    echo ""
    echo "Please install ffmpeg first:"
    echo "  Mac:     brew install ffmpeg"
    echo "  Ubuntu:  sudo apt install ffmpeg"
    echo "  Windows: Download from https://ffmpeg.org"
    echo ""
    exit 1
fi
echo "✅ ffmpeg found"
echo ""

# Backend setup
echo "======================================================"
echo "🔧 Setting up Backend..."
echo "======================================================"
cd backend

# Create virtual environment
echo "Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Install requirements
echo "Installing Python dependencies..."
pip install -r requirements.txt

echo ""
echo "✅ Backend setup complete!"
echo ""
echo "⚠️  IMPORTANT: Configure email settings in backend/app.py"
echo "    Edit lines 24-27 with your Gmail credentials"
echo ""

# Frontend setup
echo "======================================================"
echo "🎨 Setting up Frontend..."
echo "======================================================"
cd ../frontend

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found!"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi

# Install dependencies
echo "Installing Node dependencies (this may take a few minutes)..."
npm install

echo ""
echo "✅ Frontend setup complete!"
echo ""

# Done
echo "======================================================"
echo "🎉 SETUP COMPLETE!"
echo "======================================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Configure Email (REQUIRED):"
echo "   - Open backend/app.py"
echo "   - Update EmailConfig class (lines 24-27)"
echo "   - Add your Gmail and App Password"
echo ""
echo "2. Start Backend:"
echo "   cd backend"
echo "   source venv/bin/activate  # Windows: venv\\Scripts\\activate"
echo "   python app.py"
echo ""
echo "3. Start Frontend (in a new terminal):"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "4. Open browser:"
echo "   http://localhost:3000"
echo ""
echo "For detailed instructions, see:"
echo "  - QUICKSTART.md (Quick start guide)"
echo "  - README.md (Full documentation)"
echo "  - DEPLOYMENT.md (Deployment guide)"
echo ""
echo "======================================================"
