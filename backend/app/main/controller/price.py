from flask import Blueprint, jsonify, request
from app.main.database.db import get_db_connection
import logging
import time

logger = logging.getLogger(__name__)
currentprice_bp = Blueprint('currentprice', __name__, url_prefix='/api')

@currentprice_bp.route('/current-prices', methods=['GET'])
def get_current_prices():
    """
    Get all current stock prices from the database
    Returns a dictionary mapping stock symbols to their current prices
    """
    start_time = time.time()
    logger.info(f"[API] Received request for current prices from {request.remote_addr}")
    
    try:
        # Establish database connection
        logger.debug("Attempting to establish database connection")
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Execute query to fetch current prices
        logger.debug("Executing SQL query to fetch current prices")
        query = "SELECT symbol, current_price as price, last_updated FROM current_prices;"
        cursor.execute(query)
        
        # Process query results
        result = cursor.fetchall()
        prices = {row['symbol']: float(row['price']) for row in result}
        
        # Log successful retrieval with details
        symbol_count = len(prices)
        execution_time = time.time() - start_time
        logger.info(f"Successfully retrieved {symbol_count} stock prices in {execution_time:.3f}s")
        
        # Sample price data for debugging (limit to 3 items)
        if prices:
            sample_data = dict(list(prices.items())[:3])
            logger.debug(f"Sample price data: {sample_data}...")
        
        # Cleanup resources
        logger.debug("Closing database connection")
        cursor.close()
        conn.close()
        
        return jsonify(prices)
    except Exception as e:
        # Enhanced error logging with exception details
        logger.error(f"Failed to retrieve current prices: {str(e)}", exc_info=True)
        logger.error(f"Error occurred after {time.time() - start_time:.3f}s")
        return jsonify({"error": "Failed to retrieve stock price data", "details": str(e)}), 500