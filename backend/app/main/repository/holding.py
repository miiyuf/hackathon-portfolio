from app.main.db import get_db_connection
from flask import Blueprint, request, jsonify
import logging

logger = logging.getLogger(__name__)
# holdings_bp = Blueprint('holdings', __name__, url_prefix='/api')

# @holdings_bp.route('/holdings', methods=['GET'])
def get_holdings(day=None):
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
    from transactions s 
    LEFT JOIN stock_master sm ON s.symbol = sm.symbol 
    GROUP BY s.symbol, sm.name
    HAVING total_quantity > 0;
    """
    if day:
        query = f"""
        SELECT s.symbol, sm.name, MAX(s.created_at),
            SUM(CASE WHEN s.action = 'buy' THEN s.quantity ELSE -s.quantity END) AS total_quantity, 
            avg(CASE WHEN s.action='buy' THEN s.purchase_price ELSE NULL END) as cost_price
        FROM transactions s 
        LEFT JOIN stock_master sm ON s.symbol = sm.symbol
        WHERE s.created_at <= '{day}' 
        GROUP BY s.symbol, sm.name
        HAVING total_quantity > 0;"""

    logger.info(f"Executing query: {query}")
        
    cursor.execute(query)
    results = cursor.fetchall()
    cursor.close()
    conn.close()

    return results