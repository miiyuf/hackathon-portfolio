import yfinance as yf
from mysql.connector import Error

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
    




