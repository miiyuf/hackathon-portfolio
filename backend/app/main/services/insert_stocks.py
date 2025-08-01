from flask import Blueprint, request, jsonify
from app.main.db import get_db_connection
from mysql.connector import Error
import yfinance as yf
stockinsert_bp = Blueprint('insert_stocks', __name__, url_prefix='/api')

@stockinsert_bp.route('/stocks', methods=['POST'])  
def insert_stock():
    """
    Insert a new stock record into the 'stocks' table.
    Expects a JSON payload with the following fields:
        - symbol: Stock symbol (string)
        - purchase_price: purchase price of the stock (float)
        - action: Action type (e.g., 'buy' or 'sell') (string)
        - quantity: Quantity of the stock (integer)
    Returns:
        JSON response with a success message or an error message if the insertion fails.
    """
    data = request.get_json()

    required_fields = ['symbol', 'purchase_price', 'action', 'quantity']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    conn = get_db_connection()
    if isinstance(conn, tuple):
        return conn

    try:
        cursor = conn.cursor()
        query = """
            INSERT INTO stocks (symbol, purchase_price, action, quantity)
            VALUES (%s, %s, %s, %s)
        """
        values = (
            data['symbol'],
            data['purchase_price'],
            data['action'],
            data['quantity']
        )
        cursor.execute(query, values)
        conn.commit()
        name = get_stock_name_from_ticker(data['symbol'])
        if not name:
            raise ValueError(f"Could not retrieve name for {data['symbol']}")
        insert_stock_symbol_pair(data['symbol'], name)
        return jsonify({"message": "Stock inserted successfully"}), 201
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()
   
def insert_stock_symbol_pair(ticker, name):
    conn = get_db_connection()
    if isinstance(conn, tuple):
        return conn
    try:
        cursor = conn.cursor()
        query = """
            INSERT INTO stock_master (symbol, name)
            VALUES (%s, %s)
        """
        values = (
            ticker, name
        )
        cursor.execute(query, values)
        conn.commit()
        return jsonify({"message": "Stock Master table updated successfully"}), 201
    except Error as e:
        return e
    finally:
        cursor.close()
        conn.close()
    

def get_stock_name_from_ticker(ticker):
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        return info.get("shortName", None)
    except Exception as e:
        return e