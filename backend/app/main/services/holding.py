from app.main.db import get_db_connection
from flask import Blueprint, request, jsonify

holdings_bp = Blueprint('holdings', __name__, url_prefix='/api')

@holdings_bp.route('/holdings', methods=['GET'])
def get_holdings():
    """
    Retrieve the curent holdings by calculating the net quantity of each stock.
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