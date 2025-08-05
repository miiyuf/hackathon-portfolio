from app.main.db import get_db_connection
from flask import Blueprint, request, jsonify

# transaction_bp = Blueprint('transaction', __name__, url_prefix='/api')

# @transaction_bp.route('/transaction', methods=['GET'])
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

    query = """
    SELECT stocks.id, stocks.symbol, stock_master.name, stocks.purchase_price, 
    stocks.action, stocks.quantity
    FROM stocks
    JOIN stock_master ON stocks.symbol=stock_master.symbol
    ORDER BY stocks.id DESC;
    """
    cursor.execute(query)

    results = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(results)