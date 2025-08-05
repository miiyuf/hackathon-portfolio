from flask import Flask, jsonify, request
from dotenv import load_dotenv
import os
import mysql.connector
from mysql.connector import Error
from app.routers.stock import stock_bp
from app.routers.trade import trade_bp
import yfinance as yf
from apscheduler.schedulers.background import BackgroundScheduler
import atexit


# Load .env file
load_dotenv()

app = Flask(__name__)

# Register blueprints for stock and trade routes
app.register_blueprint(stock_bp)
app.register_blueprint(trade_bp)


# def get_db_connection():
#     """
#     Establish a connection to the MySQL database using credentials from environment variables.
#     Returns:
#         A MySQL connection object if successful, or a JSON response with an error message if the connection fails.
#     """
#     try:
#         connection = mysql.connector.connect(
#             host=os.getenv('DB_HOST'),
#             user=os.getenv('DB_USER'),
#             password=os.getenv('DB_PASSWORD'),
#             database=os.getenv('DB_NAME')
#         )
#         return connection
#     except Error as e:
#         error_message = f"MySQL connection error: {e}"
#         print(error_message)
#         return jsonify({"error": error_message}), 500

# def get_real_price(symbol):
#     """
#     Fetch the real-time price of a stock using yfinance.
#     Args:
#         symbol (str): Stock symbol.
#     Returns:
#         float: Current price of the stock, or None if an error occurs.
#     """
#     try:
#         stock = yf.Ticker(symbol)
#         price = stock.history(period="1d")["Close"].iloc[-1]
#         return price
#     except Exception as e:
#         print(f"Error fetching price for {symbol}: {e}")
#         return None

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
        FROM portfolio
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

# @app.route('/api/stocks', methods=['GET'])
# def get_stocks():
#     """
#     Retrieve all stock records from the 'stocks' table.
#     Returns:
#         JSON response with the list of stocks or an error message if the DB connection fails.
#     """
#     conn = get_db_connection()
#     if isinstance(conn, tuple):
#         return conn

#     cursor = conn.cursor(dictionary=True)
#     cursor.execute("SELECT * FROM portfolio;")
#     results = cursor.fetchall()
#     cursor.close()
#     conn.close()

#     return jsonify(results)

# @app.route('/api/stocks', methods=['POST'])
# def insert_stock():
#     """
#     Insert a new stock record into the 'stocks' table.
#     Expects a JSON payload with the following fields:
#         - symbol: Stock symbol (string)
#         - name: Stock name (string)
#         - purchase_price: purchase price of the stock (float)
#         - action: Action type (e.g., 'buy' or 'sell') (string)
#         - quantity: Quantity of the stock (integer)
#     Returns:
#         JSON response with a success message or an error message if the insertion fails.
#     """
#     data = request.get_json()

#     required_fields = ['symbol', 'name', 'purchase_price', 'action', 'quantity']
#     if not all(field in data for field in required_fields):
#         return jsonify({"error": "Missing required fields"}), 400

#     conn = get_db_connection()
#     if isinstance(conn, tuple):
#         return conn

#     try:
#         cursor = conn.cursor()
#         query = """
#             INSERT INTO stocks (symbol, name, purchase_price, action, quantity)
#             VALUES (%s, %s, %s, %s, %s)
#         """
#         values = (
#             data['symbol'],
#             data['name'],
#             data['purchase_price'],
#             data['action'],
#             data['quantity']
#         )
#         cursor.execute(query, values)
#         conn.commit()
#         return jsonify({"message": "Stock inserted successfully"}), 201
#     except Error as e:
#         return jsonify({"error": str(e)}), 500
#     finally:
#         cursor.close()
#         conn.close()

# @app.route('/api/transactions', methods=['GET'])
# def get_transactions():
#     """
#     Fetch all transactions from the 'stocks' table, ordered by ID (latest first).
#     Returns:
#         JSON response with the list of transactions or an error message if the DB connection fails.
#     """
#     conn = get_db_connection()
#     if isinstance(conn, tuple):
#         return conn

#     cursor = conn.cursor(dictionary=True)
#     cursor.execute("SELECT * FROM portfolio ORDER BY id DESC;")
#     results = cursor.fetchall()
#     cursor.close()
#     conn.close()

#     return jsonify(results)

# @app.route('/api/holdings', methods=['GET'])
# def get_holdings():
#     """
#     Retrieve the current holdings by calculating the net quantity of each stock.
#     Returns:
#         JSON response with the list of holdings or an error message if the DB connection fails.
#     """
#     holdings = fetch_holdings()
#     return jsonify(holdings)

# @app.route('/api/price/<symbol>', methods=['GET'])
# def get_stock_price(symbol):
#     """
#     Retrieve the real-time price of a stock using its symbol.
#     Args:
#         symbol (str): Stock symbol passed as a URL parameter.
#     Returns:
#         JSON response with the current price or an error message if the price cannot be fetched.
#     """
#     price = get_real_price(symbol)
#     if price is None:
#         return jsonify({"error": f"Error fetching price for {symbol}"}), 500
#     return jsonify({"symbol": symbol, "price": price})

@app.route('/api/portfolio', methods=['GET'])
def get_portfolio():
    """
    Retrieve the portfolio, including holdings and their current prices.
    Returns:
        JSON response with the portfolio details or an error message if the DB connection fails.
    """
    holdings = fetch_holdings()
    portfolio = []
    for holding in holdings:
        symbol = holding['symbol']
        current_price = get_real_price(symbol)
        if current_price is not None:
            holding['current_price'] = current_price
            holding['total_value'] = current_price * holding['total_quantity']
        else:
            holding['current_price'] = None
            holding['total_value'] = None
        portfolio.append(holding)

    return jsonify(portfolio)

@app.route('/api/profit_loss', methods=['GET'])
def get_profit_loss():
    """
    Calculate the profit or loss for each holding based on the current price and purchase price.
    Returns:
        JSON response with the profit/loss details for each holding or an error message if the DB connection fails.
    """
    holdings = fetch_holdings(include_purchase_price=True)
    profit_loss_data = []
    for holding in holdings:
        symbol = holding['symbol']
        current_price = get_real_price(symbol)
        if current_price is not None:
            profit_loss = (current_price - holding['purchase_price']) * holding['total_quantity']
            holding['current_price'] = current_price
            holding['profit_loss'] = profit_loss
        else:
            holding['current_price'] = None
            holding['profit_loss'] = None
        profit_loss_data.append(holding)

    return jsonify(profit_loss_data)

def update_current_prices():
    """
    Fetch and update the latest stock prices for all stocks in the database.
    """
    conn = get_db_connection()
    if isinstance(conn, tuple):
        print("Database connection failed.")
        return

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT DISTINCT symbol FROM portfolio;")
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

scheduler = BackgroundScheduler()
scheduler.add_job(func=update_current_prices, trigger="interval", minutes=5)
scheduler.start()

# Ensure the scheduler shuts down when the app exits
atexit.register(lambda: scheduler.shutdown())

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)

