import yfinance as yf
from app.main.db import get_db_connection

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
    Retrieve the current holdings by calculating the net quantity of each stock.
    Args:
        include_purchase_price (bool): Whether to include purchase price in the results.
    Returns:
        List[Dict]: List of holdings or an empty list if the DB connection fails.
    """
    conn = get_db_connection()
    if isinstance(conn, tuple):
        return []

    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT symbol, name, 
            SUM(CASE WHEN action = 'buy' THEN quantity ELSE -quantity END) AS total_quantity
        {purchase_price_column}
        FROM stocks
        GROUP BY symbol, name {purchase_price_group}
        HAVING total_quantity > 0;
    """.format(
        purchase_price_column=", purchase_price" if include_purchase_price else "",
        purchase_price_group=", purchase_price" if include_purchase_price else ""
    )
    cursor.execute(query)
    results = cursor.fetchall()
    cursor.close()
    conn.close()

    return results


def update_current_prices():
    """
    Fetch and update the latest stock prices for all stocks in the database.
    """
    conn = get_db_connection()
    if isinstance(conn, tuple):
        print("Database connection failed.")
        return

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT DISTINCT symbol FROM stocks;")
    symbols = cursor.fetchall()

    for record in symbols:
        symbol = record['symbol']
        current_price = get_real_price(symbol)
        if current_price is None:
            print(f"Failed to fetch price for {symbol}.")
            continue
        try:
            update_query = "UPDATE stocks SET current_price = %s WHERE symbol = %s;"
            cursor.execute(update_query, (current_price, symbol))
            conn.commit()
            print(f"Updated price for {symbol}: {current_price}")
        except Error as e:
            print(f"Error updating price for {symbol}: {e}")

    cursor.close()
    conn.close()
