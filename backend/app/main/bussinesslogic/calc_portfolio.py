import logging
import yfinance as yf
from app.main.db import get_db_connection
from mysql.connector import Error

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_real_price(symbol, fallback_to_dummy=False):
    """
    Retrieve the current price for the specified stock symbol.
    Args:
        symbol: Stock ticker symbol
        fallback_to_dummy: If True, returns a dummy value when price is not found
    Returns:
        float: Current price or None if not available
    """
    try:
        logger.info(f"get_real_price: Fetching price for {symbol}")
        
        conn = get_db_connection()
        if not conn:
            logger.error("get_real_price: Database connection failed")
            return None if not fallback_to_dummy else generate_dummy_price(symbol)
            
        cursor = conn.cursor(dictionary=True)
        query = "SELECT current_price FROM current_prices WHERE symbol = %s"
        cursor.execute(query, (symbol,))
        result = cursor.fetchone()
        
        if result and result['current_price']:
            logger.info(f"get_real_price: Found price for {symbol}: {result['current_price']}")
            return result['current_price']
        else:
            logger.warning(f"get_real_price: No price found for {symbol}")
            return None if not fallback_to_dummy else generate_dummy_price(symbol)
            
    except Exception as e:
        logger.error(f"get_real_price: Error fetching price for {symbol}: {e}")
        return None if not fallback_to_dummy else generate_dummy_price(symbol)
    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'conn' in locals() and conn:
            conn.close()

def generate_dummy_price(symbol):
    """Generate a test price based on the symbol's hash value"""
    import hashlib
    # Generate a price between 100-500 based on the hash value of the symbol
    hash_val = int(hashlib.md5(symbol.encode()).hexdigest(), 16)
    price = 100 + (hash_val % 400)
    logger.warning(f"Using generated dummy price for {symbol}: {price}")
    return float(price)

def fetch_holdings():
    """
    Retrieve current stock holdings with optional purchase price.
    Args:
        include_purchase_price (bool): Whether to include average purchase price in the results.
    Returns:
        List[Dict]: List of holdings or empty list on connection error.
    """
    logger.info("Fetching holdings from the database.")
    conn = get_db_connection()
    if isinstance(conn, tuple):
        return []

    cursor = conn.cursor(dictionary=True)

    # Query modified to include total buy and sell values
    query = """
        SELECT 
            s.symbol,
            sm.name,
            SUM(CASE WHEN s.action = 'buy' THEN s.quantity ELSE -s.quantity END) AS total_quantity,
            SUM(CASE WHEN s.action = 'buy' THEN s.quantity * s.purchase_price ELSE 0 END) AS total_buy_value,
            SUM(CASE WHEN s.action = 'sell' THEN s.quantity * s.purchase_price ELSE 0 END) AS total_sell_value
        FROM stocks s
        LEFT JOIN stock_master sm ON s.symbol = sm.symbol
        GROUP BY s.symbol, sm.name
        HAVING SUM(CASE WHEN s.action = 'buy' THEN s.quantity ELSE -s.quantity END) > 0
    """
    
    logger.info("Fetching holdings with buy/sell values.")

    try:
        cursor.execute(query)
        results = cursor.fetchall()
        logger.info(f"Fetched {len(results)} holdings from the database.")
    except Error as e:
        logger.error(f"Error executing query: {e}")
        results = []
    finally:
        cursor.close()
        conn.close()
        logger.info("Database connection closed.")

    return results

def update_current_prices():
    """
    Fetch and update the latest stock prices for all stocks in the database.
    """
    logger.info("Starting update of current prices")
    conn = get_db_connection()
    if isinstance(conn, tuple):
        logger.error("Database connection failed.")
        return

    try:
        cursor = conn.cursor(dictionary=True)
        # Get all distinct stock symbols
        cursor.execute("SELECT DISTINCT symbol FROM stocks;")
        symbols = cursor.fetchall()
        logger.info(f"Found {len(symbols)} distinct symbols in stocks table")

        for record in symbols:
            symbol = record['symbol']
            
            # In a production environment, fetch real prices using Yahoo Finance API
            # Example: stock_data = yf.Ticker(symbol)
            # real_price = stock_data.info.get('regularMarketPrice')
            
            # Generate random prices for demo/testing (remove in production)
            import random
            real_price = round(random.uniform(50, 500), 2)
            logger.info(f"Generated test price for {symbol}: {real_price}")
            
            try:
                # Insert or update record in the current_prices table
                update_query = """
                INSERT INTO current_prices (symbol, current_price, last_updated) 
                VALUES (%s, %s, NOW()) 
                ON DUPLICATE KEY UPDATE current_price = %s, last_updated = NOW();
                """
                cursor.execute(update_query, (symbol, real_price, real_price))
                conn.commit()
                logger.info(f"Updated price for {symbol}: {real_price}")
            except Error as e:
                logger.error(f"Error updating price for {symbol}: {e}")
                conn.rollback()

    except Error as e:
        logger.error(f"Error in update_current_prices: {e}")
    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()
        if conn:
            conn.close()
        logger.info("Completed update of current prices")
