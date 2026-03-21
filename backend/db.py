import mysql.connector
from mysql.connector import Error
from config import DB_CONFIG


def get_db_connection():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        return conn
    except Error as e:
        print("Database connection error:", e)
        return None