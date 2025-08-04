from app.main.database.db import get_db_connection
import logging
import yfinance as yf
from mysql.connector import Error

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def fetch_holdings(include_purchase_price=False):
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

    if include_purchase_price:
        query = """
            SELECT 
                total.symbol,
                sm.name,
                total.total_quantity,
                ROUND(buy.total_buy_value / NULLIF(buy.total_buy_quantity, 0), 2) AS purchase_price
            FROM (
                SELECT 
                    symbol,
                    SUM(CASE WHEN action = 'buy' THEN quantity ELSE -quantity END) AS total_quantity
                FROM stocks
                GROUP BY symbol
                HAVING total_quantity > 0
            ) AS total
            LEFT JOIN (
                SELECT 
                    symbol,
                    SUM(purchase_price * quantity) AS total_buy_value,
                    SUM(quantity) AS total_buy_quantity
                FROM stocks
                WHERE action = 'buy'
                GROUP BY symbol
            ) AS buy ON total.symbol = buy.symbol
            LEFT JOIN stock_master sm ON total.symbol = sm.symbol;
        """
        logger.info("Including purchase price in the query.")
    else:
        query = """
            SELECT 
                s.symbol,
                sm.name,
                SUM(CASE WHEN s.action = 'buy' THEN s.quantity ELSE -s.quantity END) AS total_quantity
            FROM stocks s
            LEFT JOIN stock_master sm ON s.symbol = sm.symbol
            GROUP BY s.symbol, sm.name
            HAVING total_quantity > 0;
        """
        logger.info("Fetching holdings without purchase price.")
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