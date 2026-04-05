/**
## Setup Instructions

### Frontend Setup
1. Navigate to the app directory:
    ```bash
    cd app
    ```
2. Install dependencies and start the dev server:
     ```bash
    npm install
    npm run dev
    ```

### Backend Setup
1. Navigate to the backend directory:
    ```bash
    cd backend
    ```
2. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3. Start the Flask server:
    ```bash
    python app.py  or venv/Scripts/python app.py

    ```

### Backend Setup (Virtual Environment)
If you encounter issues, use a virtual environment:

```bash
python --version
python -m venv venv
source venv/Scripts/activate  # On Windows: venv\Scripts\activate
pip install google-generativeai flask flask-cors sentence-transformers reportlab python-docx mysql-connector-python
python app.py
pip freeze > requirements.txt
```

Your app will be running locally once both servers start.

# AI-Based Question Paper Generator (QPG Flow)

Intelligent, automated question paper generation powered by AI and Bloom's Taxonomy alignment.

---

## 📋 Overview

**QPG Flow** is an intelligent question paper generation platform that eliminates manual paper creation. Teachers and examiners input a syllabus, specify parameters, and AI instantly generates balanced, high-quality question papers with zero repetition—each paper is unique, difficulty-scaled, and aligned with Bloom's Taxonomy cognitive levels.

The platform automates:
- **Intelligent question generation** using NLP & AI
- **Bloom's Taxonomy alignment** (Remember → Understand → Apply → Analyze → Evaluate → Create)
- **Balanced difficulty distribution** (Easy, Medium, Hard)
- **Format variety** (MCQ, Short-answer, Case-based, Essay)
- **Automatic answer key generation** with evaluation rubrics
- **PDF export** of complete papers

---

## 🎯 Objective

### Problem Statement
Educational institutions face several pain points:
- **Manual, time-consuming** paper creation (hours/days per paper)
- **Question repetition** across exams (compromising exam integrity)
- **Inconsistent difficulty scaling** and cognitive level distribution
- **No systematic rubrics** for evaluation
- **Limited customization** options for different courses/levels

### Solution
QPG Flow addresses these by:
- ✅ **Reduce creation time** from hours to minutes
- ✅ **Guarantee zero question repetition** using AI deduplication
- ✅ **Automatic Bloom's Taxonomy alignment** for cognitive rigor
- ✅ **Balanced difficulty distribution** matching exam requirements
- ✅ **Multi-format support** (MCQ, subjective, case-based, etc.)
- ✅ **Generate complete evaluation rubrics** automatically
- ✅ **Secure, role-based access** for institutions

---

## 💻 Technologies Used

### Frontend
- **Framework:** React 18, Vite (dev server)
- **Routing:** React Router v6
- **Authentication:** Firebase (Email/Password + Google Sign-In)
- **Styling:** Tailwind CSS + custom CSS
- **State Management:** React Context API
- **Validation:** HTML5 form validation

### Backend
- **Framework:** Flask (Python)
- **Server:** Gunicorn (production)
- **Database:** Supabase (PostgreSQL)
- **AI/NLP:** Groq API (Llama 3.3-70B for generation)
- **PDF Generation:** ReportLab
- **API:** REST with CORS enabled
- **Environment:** Python 3.8+

### DevOps & Deployment
- **Frontend Hosting:** Vercel / Docker
- **Backend Hosting:** Render / Docker
- **Containerization:** Docker & Docker Compose
- **CI/CD:** GitHub Actions
- **Version Control:** Git + GitHub

### Key Dependencies
```
Backend: flask, flask-cors, groq, supabase, reportlab, python-dotenv, gunicorn
Frontend: react, react-router-dom, firebase
```

---

## 📊 Data Model & Architecture

### Paper Structure
Papers consist of:
- **Metadata:** Subject, teacher, department, class, semester, exam type
- **Sections:** Multiple configurable sections with:
  - Question count & marks per question
  - Bloom's cognitive level
  - Difficulty (Easy/Medium/Hard)
  - Question format (MCQ/Subjective/Case-based)
  - Attempt rules (Attempt All / Attempt X of Y)
- **Auto-generated:** Answer keys, scoring rubrics, difficulty metrics

### System Architecture
```
User Input (Syllabus + Parameters)
        ↓
AI Question Generation (Groq API)
        ↓
Deduplication & Quality Check
        ↓
Bloom's Taxonomy Alignment
        ↓
PDF Compilation (ReportLab)
        ↓
Download & Archive
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 16+ & npm
- Python 3.8+
- Git

### Quick Start

#### Clone Repository
```bash
git clone https://github.com/your-username/qpg-flow.git
cd qpg-flow
```

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
GROQ_API_KEY=your_groq_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_SECRET_KEY=your_supabase_secret
FLASK_ENV=development
FLASK_DEBUG=True
EOF

# Start server
python app.py
# Runs on http://localhost:5000
```

#### Frontend Setup
```bash
cd app
npm install

# Create .env file
cat > .env << EOF
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=http://localhost:5000
EOF

# Start dev server
npm run dev
# Runs on http://localhost:3000
```

#### With Docker Compose (Recommended)
```bash
# From project root
docker-compose up

# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

---

## 📖 Usage Guide

### For Teachers/Examiners

**Complete Workflow:**

1. **Login** → Sign up with email or Google
2. **Dashboard** → Go to `/dashboard`
3. **Step 1 - Setup:**
   - Enter subject, class, department
   - Paste syllabus content
   - Specify total marks
   - Choose paper type

4. **Step 2 - Create Sections:**
   - Add sections (A, B, C, etc.)
   - Configure each section:
     - Question count & marks
     - Bloom's level
     - Difficulty
     - Format (MCQ/Short/Case Study)
     - Attempt rules

5. **Step 3 - Generate:**
   - AI generates questions matching configuration
   - View live progress
   - System validates total marks

6. **Step 4 - Preview:**
   - Review paper layout
   - Check answer keys
   - Edit if needed

7. **Step 5 - Export:**
   - Download PDF (paper + answers + rubric)
   - Share with students
   - Archive for records

### For Students
- View assigned papers
- Attempt papers with timer
- View answers after submission

### For Admins
- Monitor usage analytics
- Manage institutions
- Configure AI settings

---

## ✨ Key Features

### 🤖 AI-Powered Generation
- **Groq LLM** for high-quality content
- **Context-aware** based on syllabus
- **Automatic difficulty scaling**
- **Zero repetition** guarantee

### 📚 Bloom's Taxonomy Support
All 6 cognitive levels:
1. Remember (Recall facts)
2. Understand (Explain concepts)
3. Apply (Use knowledge)
4. Analyze (Break down topics)
5. Evaluate (Make judgments)
6. Create (Generate new ideas)

### 💡 Flexible Configuration
- **Multiple formats:** MCQ, Subjective, Case-based, Essay
- **Unlimited sections:** Create custom paper structure
- **Auto-validation:** Ensure marks match total
- **Attempt rules:** Selective or mandatory questions

### 🔐 Firebase Authentication
- Secure email/password login
- Google Sign-In integration
- Persistent sessions
- Role-based access

### 📄 Professional Exports
- Formatted PDF papers (academic style)
- Automatic answer keys
- Scoring rubrics
- Print-ready design

---

## 🚢 Deployment

### Frontend (Vercel)
```bash
npm install -g vercel
cd app
vercel
# Connect GitHub and deploy
```

### Backend (Render)
1. Create account at [render.com](https://render.com)
2. Create **Web Service**
3. Connect GitHub repo
4. **Build Command:** `pip install -r requirements.txt`
5. **Start Command:** `gunicorn app:app`
6. **Environment Variables:**
   ```
   GROQ_API_KEY=<your_key>
   SUPABASE_URL=<your_url>
   SUPABASE_SECRET_KEY=<your_key>
   FLASK_ENV=production
   FLASK_DEBUG=False
   ```
7. Deploy

> **⚠️ Important:** Always set `FLASK_DEBUG=False` in production (security)

---

## 📊 Project Structure

```
qpg-flow/
├── app/                          # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── landing/
│   │   │   ├── dashboard/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── config/
│   │   │   ├── firebase.js
│   │   │   └── authUtils.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/                     # Flask Backend
│   ├── app.py
│   ├── db.py
│   ├── generators/
│   │   ├── question_generator.py
│   │   ├── answer_generator.py
│   │   └── paper_builder.py
│   ├── routes/
│   │   ├── subjects.py
│   │   ├── paper.py
│   │   └── answers.py
│   ├── utils/
│   │   ├── bloom_classifier.py
│   │   ├── pdf_builder.py
│   │   └── similarity_checker.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── notebooks/                   # ML Experiments
│   └── gemini_testing.ipynb
│
├── docker-compose.yml
└── README.md
```

---

## 🔌 API Endpoints

```
POST   /api/papers                      Generate new paper
GET    /api/papers/:id                  Get paper details
POST   /api/generate                    AI generation
GET    /api/subjects                    List subjects
POST   /api/export/pdf                  Export as PDF
GET    /api/answers/:paper_id           Get answer key
```

See `AUTHENTICATION_SETUP.md` for Firebase auth details.

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| `ModuleNotFoundError: supabase` | `pip install -r requirements.txt` |
| Firebase not initialized | Verify `VITE_FIREBASE_*` in `.env` |
| Port 3000/5000 in use | Change port or kill process |
| PDF not generating | Check ReportLab: `pip install reportlab` |
| AI responses repetitive | Increase Groq temperature (0.7 → 0.9) |

---

## 🤝 Contributing

Contributions welcome! Please:

1. **Fork** repository
2. **Create** feature branch: `git checkout -b feature/your-feature`
3. **Commit** changes: `git commit -m 'Add feature'`
4. **Push:** `git push origin feature/your-feature`
5. **Open** Pull Request

### Areas to Contribute
- 🐛 Bug fixes
- ✨ New question formats
- 📈 Analytics
- 🎨 UI/UX improvements
- 📚 Documentation

---

## 📚 References

- [Flask Docs](https://flask.palletsprojects.com/)
- [React Docs](https://react.dev/)
- [Firebase Auth](https://firebase.google.com/docs/auth)
- [Groq API](https://console.groq.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Bloom's Taxonomy](https://en.wikipedia.org/wiki/Bloom%27s_taxonomy)

---

## 📝 License

MIT License - see LICENSE file for details

---

**Made with ❤️ for educators worldwide** 🎓