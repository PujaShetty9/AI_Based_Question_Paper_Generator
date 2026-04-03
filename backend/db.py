import mysql.connector
from mysql.connector import Error
from config import DB_CONFIG


def get_db_connection():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        return conn
    except Error as e:
        raise ConnectionError(f"Database connection failed: {e}")


def execute_query(query, params=None, fetch=True):
    """
    Reusable helper for running queries.
    - fetch=True  → returns rows (SELECT)
    - fetch=False → commits and returns lastrowid (INSERT/UPDATE/DELETE)
    """
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute(query, params or ())

        if fetch:
            result = cursor.fetchall()
            return result
        else:
            conn.commit()
            return cursor.lastrowid

    finally:
        cursor.close()
        conn.close()