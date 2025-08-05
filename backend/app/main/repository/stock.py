from app.main.database.db import get_db_connection
from flask import Blueprint, request, jsonify
from mysql.connector import Error
import yfinance as yf
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_stocks():
    """
    Retrieve all stock records from the 'stocks' table.
    Returns:
        JSON response with the list of stocks or an error message if the DB connection fails.
    """
    conn = get_db_connection()
    if conn is None:
        # return jsonify({"error": "DB connection failed"}), 500
        return []


    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM portfolio;")
    results = cursor.fetchall()
    cursor.close()
    conn.close()

    return results



def insert_stock(data):
    """
    Insert a new stock record into the 'stocks' table.
    Expects a JSON payload with the following fields:
        - symbol: Stock symbol (string)
        - name: Stock name (string)
        - purchase_price: purchase price of the stock (float)
        - action: Action type (e.g., 'buy' or 'sell') (string)
        - quantity: Quantity of the stock (integer)
    Returns:
        JSON response with a success message or an error message if the insertion fails.
    """
    # data = request.get_json()

    # required_fields = ['symbol', 'name', 'purchase_price', 'action', 'quantity']
    # if not all(field in data for field in required_fields):
    #     # return jsonify({"error": "Missing required fields"}), 400
    #     return []

    required_fields = ['symbol', 'purchase_price', 'action', 'quantity']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    if len(data['symbol']) > 10:
        return jsonify({"error": "Symbol must be 10 characters or less"}), 400
    
    if data['action'] not in ['buy', 'sell']:
        return jsonify({"error": "Action must be either 'buy' or 'sell'"}), 400

    if 'purchase_price' not in data:
        try:
            ticker = yf.Ticker(data['symbol'])
            current_data = ticker.history(period="1d")
            
            if current_data.empty:
                return jsonify({"error": f"Could not fetch current price for {data['symbol']}"}), 400
                
            current_price = float(current_data['Close'].iloc[-1])
            data['purchase_price'] = current_price
            logger.info(f"Automatically fetched current price for {data['symbol']}: {current_price}")
        except Exception as e:
            logger.error(f"Error fetching current price for {data['symbol']}: {e}")
            return jsonify({"error": f"Failed to fetch current price: {str(e)}"}), 500
    conn = get_db_connection()
    if isinstance(conn, tuple):
        return conn
    
    try:
        cursor = conn.cursor()
        query = """
            INSERT INTO portfolio (symbol, purchase_price, action, quantity)
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
        
        return jsonify({
            "message": "Stock inserted successfully",
            "used_price": data['purchase_price'],
            "price_source": "user_provided" if 'purchase_price' in request.get_json() else "yahoo_finance"
        }), 201
    except Error as e:
        logger.error(f"Error inserting stock: {e}")
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
            INSERT INTO portfolio_master (symbol, name)
            VALUES (%s, %s)
        """
        values = (
            ticker, name
        )
        cursor.execute(query, values)
        conn.commit()
        return jsonify({"message": "Stock Master table updated successfully"}), 201
    except Error as e:
        return jsonify({"error": "Failed to update Stock Master table", "details": str(e)}), 500
    finally:
        cursor.close()
        conn.close()
    

def get_stock_name_from_ticker(ticker):
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        return info.get("shortName", None)
    except Exception as e:
        return str(e)
