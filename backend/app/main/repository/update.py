from app.main.database.db import get_db_connection
from mysql.connector import Error
from app.main.service.getrealprice import get_real_price

def update_current_prices():
    """
    Fetch and update the latest stock prices for all stocks in the database.
    """
    conn = get_db_connection()
    if isinstance(conn, tuple):
        print("Database connection failed.")
        return

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT DISTINCT symbol from transactions;")
    symbols = cursor.fetchall()
    
    success_count = 0
    total_count = len(symbols)

    for record in symbols:
        symbol = record['symbol']
        current_price = get_real_price(symbol)
        if current_price is None:
            print(f"Failed to fetch price for {symbol}.")
            continue
        
        try:
            upsert_query = """
                INSERT INTO current_prices (symbol, current_price, last_updated)
                VALUES (%s, %s, NOW())
                ON DUPLICATE KEY UPDATE
                current_price = VALUES(current_price),
                last_updated = NOW()
            """
            cursor.execute(upsert_query, (symbol, current_price))
            conn.commit()
            success_count += 1
            print(f"Successfully updated price for {symbol}: {current_price}")
        except Error as e:
            print(f"Error updating price for {symbol}: {e}")
    
    print(f"Price update complete. Updated {success_count}/{total_count} symbols.")
    cursor.close()
    conn.close()
