import logging
import yfinance as yf
from app.main.db import get_db_connection
from mysql.connector import Error

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_real_price(symbol):
    """
    Fetch the real-time price of a stock using yfinance.
    Args:
        symbol (str): Stock symbol.
    Returns:
        float: Current price of the stock, or None if an error occurs.
    """
    try:
        stock = yf.Ticker(symbol)
        price = stock.history(period="1d")["Close"].iloc[-1]
        return price
    except Exception as e:
        print(f"Error fetching price for {symbol}: {e}")
        return None
    


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


def update_current_prices():
    """
    Fetch and update the latest stock prices for all stocks in the database.
    """
    conn = get_db_connection()
    if isinstance(conn, tuple):
        logger.error("Database connection failed.")
        return

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT DISTINCT symbol FROM stocks;")
    symbols = cursor.fetchall()

    for record in symbols:
        symbol = record['symbol']
        current_price = get_real_price(symbol)
        if current_price is None:
            logger.warning(f"Failed to fetch price for {symbol}.")
            continue
        try:
            update_query = "UPDATE stocks SET current_price = %s WHERE symbol = %s;"
            cursor.execute(update_query, (current_price, symbol))
            conn.commit()
            logger.info(f"Updated price for {symbol}: {current_price}")
        except Error as e:
            logger.error(f"Error updating price for {symbol}: {e}")

    cursor.close()
    conn.close()
