# GitHub Actions Workflows Setup Guide

This directory contains CI/CD workflows for your AI-Based Question Paper Generator.

## 📋 Workflows Included

### 1. **backend.yml** - Backend Tests & Deployment
- ✅ Installs Python dependencies
- ✅ Runs linting with flake8
- ✅ Runs tests with pytest
- ✅ Deploys to your chosen platform (when configured)

**Triggers:** Changes in `backend/` folder or `requirements.txt`

### 2. **frontend.yml** - Frontend Build & Deployment
- ✅ Installs Node dependencies
- ✅ Lints code with ESLint
- ✅ Builds Vite project
- ✅ Deploys to your chosen platform (when configured)

**Triggers:** Changes in `frontend/` folder

### 3. **qualify.yml** - Security & Dependency Checks
- ✅ Scans for hardcoded secrets
- ✅ Checks for required config files
- ✅ General code quality checks

**Triggers:** All pushes and PRs

---

## 🚀 How to Set Up Deployment

### **Option 1: Railway** (Recommended for beginners)
1. Create account at [railway.app](https://railway.app)
2. Create a new project
3. Go to Settings → Tokens → Create token
4. Add to GitHub Secrets:
   - `RAILWAY_TOKEN` = your token
   - `RAILWAY_PROJECT_ID` = your project ID
5. Uncomment the Railway section in `.github/workflows/backend.yml`

### **Option 2: Vercel** (For Frontend)
1. Create account at [vercel.com](https://vercel.com)
2. Install Vercel CLI: `npm i -g vercel`
3. Get your tokens from Vercel dashboard
4. Add to GitHub Secrets:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
5. Uncomment the Vercel section in `.github/workflows/frontend.yml`

### **Option 3: Netlify** (Alternative for Frontend)
1. Create account at [netlify.com](https://netlify.com)
2. Get your `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID`
3. Add to GitHub Secrets
4. Uncomment the Netlify section in `.github/workflows/frontend.yml`

### **Option 4: PythonAnywhere** (For Backend)
1. Create account at [pythonanywhere.com](https://www.pythonanywhere.com)
2. Set up a web app
3. Create webhooks for auto-deployment
4. Add webhook URL to GitHub Secrets
5. Uncomment the PythonAnywhere section in `.github/workflows/backend.yml`

---

## 🔐 Adding GitHub Secrets

1. Go to your GitHub repo
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add each secret (e.g., `RAILWAY_TOKEN`, `VERCEL_TOKEN`, etc.)

Example secrets you might need:
```
RAILWAY_TOKEN          (for Railway)
VERCEL_TOKEN           (for Vercel)
NETLIFY_AUTH_TOKEN     (for Netlify)
NETLIFY_SITE_ID        (for Netlify)
HEROKU_API_KEY         (for Heroku)
HEROKU_APP_NAME        (for Heroku)
```

---

## 📝 Environment Variables

Create a `.env` file in your `backend/` folder:
```
FLASK_ENV=production
FLASK_DEBUG=False
DATABASE_URL=your_database_url
GEMINI_API_KEY=your_key
# Add other variables
```

**Important:** Never commit `.env` file! Add to `.gitignore`:
```
.env
.env.local
__pycache__/
*.pyc
```

---

## ✅ Testing Locally Before Pushing

### Test Backend:
```bash
cd backend
pip install -r requirements.txt
pytest
flake8 .
python app.py
```

### Test Frontend:
```bash
cd frontend
npm install
npm run lint
npm run build
npm run dev
```

---

## 🐛 Debugging Failed Workflows

1. Push to GitHub
2. Go to repository → Actions tab
3. Click on failed workflow
4. Check the error logs
5. Common issues:
   - ❌ Missing dependencies in `requirements.txt` or `package.json`
   - ❌ Syntax errors in code (flake8/eslint will catch)
   - ❌ Missing environment variables
   - ❌ Incorrect deployment secrets

---

## 📚 Next Steps

1. ✅ You already have the workflow files
2. Choose your deployment platform
3. Add GitHub Secrets
4. Uncomment the deployment section for your platform
5. Push to `main` branch to trigger deployment

Questions? Check the workflow files inline comments!
