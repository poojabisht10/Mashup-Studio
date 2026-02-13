# 🚀 Deployment Guide

## Deploy to Production

---

## 📱 Frontend Deployment (Vercel)

### Option 1: Deploy with Vercel CLI

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Navigate to frontend:**
```bash
cd frontend
```

3. **Login to Vercel:**
```bash
vercel login
```

4. **Deploy:**
```bash
vercel
```

5. **Follow prompts:**
   - Set up and deploy? Yes
   - Which scope? (Select your account)
   - Link to existing project? No
   - Project name? mashup-studio
   - In which directory? ./
   - Override settings? No

6. **Set environment variable:**
```bash
vercel env add REACT_APP_API_URL production
# Enter your backend URL (e.g., https://your-backend.com)
```

7. **Deploy to production:**
```bash
vercel --prod
```

### Option 2: Deploy via GitHub

1. **Push code to GitHub**
2. **Go to** https://vercel.com
3. **Click** "Import Project"
4. **Select** your GitHub repository
5. **Configure:**
   - Framework Preset: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`
6. **Add Environment Variable:**
   - Name: `REACT_APP_API_URL`
   - Value: Your backend URL
7. **Click** "Deploy"

---

## 🖥️ Backend Deployment

### Option 1: Render.com (Recommended - FREE tier available)

1. **Push code to GitHub**

2. **Go to** https://render.com

3. **Click** "New +" → "Web Service"

4. **Connect** your GitHub repository

5. **Configure:**
   - Name: `mashup-studio-api`
   - Region: Choose closest to you
   - Branch: `main`
   - Root Directory: `backend`
   - Runtime: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`

6. **Add Environment Variables:**
   ```
   SMTP_SERVER=smtp.gmail.com
   SMTP_PORT=587
   SENDER_EMAIL=your-email@gmail.com
   SENDER_PASSWORD=your-app-password
   ```

7. **Create Web Service**

8. **Wait** for deployment (~5 minutes)

9. **Copy** your service URL (e.g., `https://mashup-studio-api.onrender.com`)

10. **Update** frontend environment variable with this URL

### Option 2: Railway.app

1. **Go to** https://railway.app

2. **Click** "Start a New Project" → "Deploy from GitHub repo"

3. **Select** your repository

4. **Configure:**
   - Root Directory: `/backend`
   - Start Command: `gunicorn app:app`

5. **Add Variables:**
   ```
   SMTP_SERVER=smtp.gmail.com
   SMTP_PORT=587
   SENDER_EMAIL=your-email@gmail.com
   SENDER_PASSWORD=your-app-password
   ```

6. **Deploy**

7. **Generate Domain** in Settings

### Option 3: PythonAnywhere (FREE tier)

1. **Sign up** at https://www.pythonanywhere.com

2. **Upload code:**
   ```bash
   # In PythonAnywhere console
   git clone your-repo-url
   cd your-repo/backend
   ```

3. **Create virtual environment:**
   ```bash
   mkvirtualenv --python=/usr/bin/python3.8 mashup-env
   pip install -r requirements.txt
   ```

4. **Configure Web App:**
   - Go to Web tab
   - Add a new web app
   - Select Flask
   - Python version: 3.8
   - Path: `/home/yourusername/your-repo/backend/app.py`

5. **Configure WSGI file:**
   ```python
   import sys
   path = '/home/yourusername/your-repo/backend'
   if path not in sys.path:
       sys.path.append(path)
   
   from app import app as application
   ```

6. **Set environment variables** in web app settings

7. **Reload** web app

---

## 🔒 Security Checklist

Before deploying:

- ✅ Change email credentials in production
- ✅ Use environment variables (never commit passwords)
- ✅ Enable HTTPS on backend
- ✅ Set up CORS properly
- ✅ Add rate limiting (optional)
- ✅ Set up monitoring (optional)

---

## 🌐 Update Frontend with Backend URL

After backend is deployed:

1. **Get backend URL** (e.g., `https://mashup-api.onrender.com`)

2. **Update frontend:**
   - In Vercel dashboard → Settings → Environment Variables
   - Set `REACT_APP_API_URL` to your backend URL

3. **Redeploy frontend** (automatic if using GitHub integration)

---

## 📊 Post-Deployment Verification

### Test Backend:
```bash
curl https://your-backend-url.com/api/health
# Should return: {"status":"healthy","timestamp":"..."}
```

### Test Frontend:
1. Visit your Vercel URL
2. Fill in the form
3. Submit a test mashup
4. Verify email is received

---

## 🔄 Continuous Deployment

### With GitHub:
1. Push changes to GitHub
2. Vercel auto-deploys frontend
3. Render/Railway auto-deploys backend

### Manual Updates:
```bash
# Frontend
cd frontend
vercel --prod

# Backend (if using manual deployment)
git push
# Then redeploy from platform dashboard
```

---

## 💰 Cost Breakdown

### Free Tier:
- **Vercel**: Unlimited frontend deployments
- **Render**: 750 hours/month free
- **Railway**: $5 credit/month
- **PythonAnywhere**: Limited but functional

### Estimated Costs (if exceeding free tier):
- **Vercel Pro**: $20/month (rarely needed)
- **Render**: ~$7/month for basic backend
- **Railway**: Pay as you go (~$5-10/month)

---

## 🐛 Troubleshooting Deployment

### Frontend not connecting to backend:
- Check REACT_APP_API_URL is set correctly
- Ensure backend CORS is configured
- Verify backend is actually running

### Backend crashing:
- Check logs in platform dashboard
- Verify all dependencies in requirements.txt
- Ensure environment variables are set

### Email not working in production:
- Verify Gmail app password is correct
- Check environment variables are set
- Test with a simple curl request

---

## 📝 Deployment Checklist

- [ ] Backend code pushed to GitHub
- [ ] Backend deployed to Render/Railway/PythonAnywhere
- [ ] Backend environment variables configured
- [ ] Backend health check working
- [ ] Frontend code pushed to GitHub
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variable set
- [ ] Frontend can reach backend
- [ ] Test mashup creation end-to-end
- [ ] Email delivery working
- [ ] Custom domain configured (optional)

---

## 🎉 Success!

Your mashup service is now live and accessible to the world!

**Share your URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-api.onrender.com`

---

## 📞 Support

If deployment fails:
1. Check platform-specific logs
2. Verify all environment variables
3. Test locally first
4. Check ffmpeg availability on platform
5. Review CORS configuration
