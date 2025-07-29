from flask import Flask, jsonify, request
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
    """
    Establish a connection to the MySQL database using credentials from environment variables.
    Returns:
        A MySQL connection object if successful, or None if the connection fails.
    """
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
    """
    Retrieve all stock records from the 'stocks' table.
    Returns:
        JSON response with the list of stocks or an error message if the DB connection fails.
    """
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "DB connection failed"}), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM stocks;")
    results = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(results)

@app.route('/api/stocks', methods=['POST'])
def insert_stock():
    """
    Insert a new stock record into the 'stocks' table.
    Expects a JSON payload with the following fields:
        - symbol: Stock symbol (string)
        - name: Stock name (string)
        - cost_price: Cost price of the stock (float)
        - action: Action type (e.g., 'buy' or 'sell') (string)
        - quantity: Quantity of the stock (integer)
    Returns:
        JSON response with a success message or an error message if the insertion fails.
    """
    data = request.get_json()

    required_fields = ['symbol', 'name', 'cost_price', 'action', 'quantity']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "DB connection failed"}), 500

    try:
        cursor = conn.cursor()
        query = """
            INSERT INTO stocks (symbol, name, cost_price, action, quantity)
            VALUES (%s, %s, %s, %s, %s)
        """
        values = (
            data['symbol'],
            data['name'],
            data['cost_price'],
            data['action'],
            data['quantity']
        )
        cursor.execute(query, values)
        conn.commit()
        return jsonify({"message": "Stock inserted successfully"}), 201
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    """
    Fetch all transactions from the 'stocks' table, ordered by ID (latest first).
    Returns:
        JSON response with the list of transactions or an error message if the DB connection fails.
    """
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "DB connection failed"}), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM stocks ORDER BY id DESC;")
    results = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(results)

@app.route('/api/holdings', methods=['GET'])
def get_holdings():
    """
    Retrieve the current holdings by calculating the net quantity of each stock.
    Returns:
        JSON response with the list of holdings or an error message if the DB connection fails.
    """
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "DB connection failed"}), 500

    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT symbol, name, 
            SUM(CASE WHEN action = 'buy' THEN quantity ELSE -quantity END) AS total_quantity
        FROM stocks
        GROUP BY symbol, name
        HAVING total_quantity > 0;
    """
    cursor.execute(query)
    results = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(results)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)

