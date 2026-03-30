/**
## Setup Instructions

### Frontend Setup
1. Navigate to the frontend directory:
    ```bash
    cd frontend
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
    python app.py
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