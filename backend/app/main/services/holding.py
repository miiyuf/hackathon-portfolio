from app.main.db import get_db_connection
from flask import Blueprint, request, jsonify

holdings_bp = Blueprint('holdings', __name__, url_prefix='/api')

@holdings_bp.route('/holdings', methods=['GET'])
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
    query="""
    SELECT s.symbol, sm.name, 
        SUM(CASE WHEN s.action = 'buy' THEN s.quantity ELSE -s.quantity END) AS total_quantity, 
        avg(CASE WHEN s.action='buy' THEN s.purchase_price ELSE NULL END) as cost_price 
    FROM stocks s 
    LEFT JOIN stock_master sm ON s.symbol = sm.symbol 
    GROUP BY s.symbol, sm.name
    HAVING total_quantity > 0;
    """
    cursor.execute(query)
    results = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(results)