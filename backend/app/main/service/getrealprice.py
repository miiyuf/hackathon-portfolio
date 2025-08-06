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
        print(stock.history(period="1d")["Close"])
        return price
    except Exception as e:
        print(f"Error fetching price for {symbol}: {e}")
        return None
    
def get_long_term_price(symbol,days=10):
    """
    Fetch the long-term price of a stock using yfinance.
    Args:
        symbol (str): Stock symbol.
    Returns:
        float: Long-term price of the stock, or None if an error occurs.
    """
    try:
        stock = yf.Ticker(symbol)
        close_prices = stock.history(period=f"{days}d")["Close"].tolist()
        return close_prices
    except Exception as e:
        print(f"Error fetching long-term price for {symbol}: {e}")
        return None
    




