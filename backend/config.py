import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY is missing. Check your .env file.")
if not SUPABASE_URL:
    raise ValueError("SUPABASE_URL is missing. Check your .env file.")
if not SUPABASE_SECRET_KEY:
    raise ValueError("SUPABASE_SECRET_KEY is missing. Check your .env file.")