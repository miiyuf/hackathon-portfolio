from flask import Flask, jsonify
from dotenv import load_dotenv
import os
import mysql.connector
from mysql.connector import Error
from flask import Flask
from app.routers.stock import stock_bp
from app.routers.trade import trade_bp


# Load .env file
load_dotenv()

app = Flask(__name__)

# Register blueprints for stock and trade routes
app.register_blueprint(stock_bp)
app.register_blueprint(trade_bp)


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
    app.run(host='0.0.0.0', port=8000, debug=True)

