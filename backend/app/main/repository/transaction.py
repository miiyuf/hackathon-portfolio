from app.main.db import get_db_connection
from flask import Blueprint, request, jsonify

# transaction_bp = Blueprint('transaction', __name__, url_prefix='/api')

# @transaction_bp.route('/transaction', methods=['GET'])
def get_transactions():
    """
    Fetch all transactions from the 'transactions' table, ordered by ID (latest first).
    Returns:
        JSON response with the list of transactions or an error message if the DB connection fails.
    """
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "DB connection failed"}), 500

    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT transactions.id, transactions.symbol, stock_master.name, transactions.purchase_price, 
    transactions.action, transactions.quantity, transactions.created_at
    FROM transactions
    JOIN stock_master ON transactions.symbol=stock_master.symbol
    ORDER BY transactions.id DESC;
    """
    cursor.execute(query)

    results = cursor.fetchall()
    
    for row in results:
        if 'created_at' in row and row['created_at'] is not None:
            row['created_at'] = row['created_at'].strftime('%Y-%m-%d %H:%M:%S')
            
    cursor.close()
    conn.close()
    
    

    return jsonify(results)