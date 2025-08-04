from app.main.database.db import get_db_connection
from mysql.connector import Error
from app.main.service.calc_portfolio import get_real_price

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
