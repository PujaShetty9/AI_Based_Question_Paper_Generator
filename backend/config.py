DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "apjak",
    "database": "question_paper_generator"
}

# Get API key from environment or use default (add to .env later)
import os
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyAO2CK-I0YjVC-mWi0x00xzmw-ESn3Nj30")