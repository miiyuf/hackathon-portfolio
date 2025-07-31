from flask import Blueprint, request, jsonify
from app.main.db import get_db_connection
from mysql.connector import Error
import logging

logger = logging.getLogger(__name__)

stockinsert_bp = Blueprint('insert_stocks', __name__, url_prefix='/api')

@stockinsert_bp.route('/stocks', methods=['POST'])  
def insert_stock():
    """
    Insert a new stock record into the 'stocks' table.
    Expects a JSON payload with the following fields:
        - symbol: Stock symbol (string, max 10 characters)
        - purchase_price: purchase price of the stock (float)
        - action: Action type ('buy' or 'sell')
        - quantity: Quantity of the stock (integer)
    Returns:
        JSON response with a success message or an error message if the insertion fails.
    """
    data = request.get_json()

    required_fields = ['symbol', 'purchase_price', 'action', 'quantity']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    if len(data['symbol']) > 10:
        return jsonify({"error": "Symbol must be 10 characters or less"}), 400
    
    if data['action'] not in ['buy', 'sell']:
        return jsonify({"error": "Action must be either 'buy' or 'sell'"}), 400

    conn = get_db_connection()
    if isinstance(conn, tuple):
        return conn
    
    cursor = None
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
        return jsonify({"message": "Stock inserted successfully"}), 201
    except Error as e:
        logger.error(f"Error inserting stock: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()