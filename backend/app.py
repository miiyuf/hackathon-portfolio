from flask import Flask, jsonify
from dotenv import load_dotenv
import os
import mysql.connector
from mysql.connector import Error

# Load .env file
load_dotenv()

app = Flask(__name__)

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host=os.getenv('DB_HOST'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            database=os.getenv('DB_NAME')
        )
        return connection
    except Error as e:
        print(f"MySQL connection error: {e}")
        return None

@app.route('/api/stocks', methods=['GET'])
def get_stocks():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "DB connection failed"}), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM stocks;")
    results = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
