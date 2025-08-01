from app.main.db import get_db_connection
from flask import Blueprint, request, jsonify


def get_transactions():
    """
    Fetch all transactions from the 'stocks' table, ordered by ID (latest first).
    Returns:
        JSON response with the list of transactions or an error message if the DB connection fails.
    """
    conn = get_db_connection()
    if conn is None:
        return []

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM stocks ORDER BY id DESC;")
    results = cursor.fetchall()
    cursor.close()
    conn.close()

    return results