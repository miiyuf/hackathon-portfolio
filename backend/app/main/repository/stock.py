from app.main.database.db import get_db_connection
from flask import Blueprint, request, jsonify
from mysql.connector import Error
import yfinance as yf
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_stocks():
    """
    Repository function to retrieve all stock records from the database.
    Returns:
        List of dictionaries representing stock records or empty list on error.
    """
    logger.info("Starting get_stocks() function")
    
    conn = get_db_connection()
    if conn is None:
        logger.error("Database connection failed")
        return []

    try:
        logger.info("Successfully connected to database")
        cursor = conn.cursor(dictionary=True)
        
        logger.info("Executing query to fetch all stocks")
        cursor.execute("SELECT * FROM portfolio;")
        results = cursor.fetchall()
        
        logger.info(f"Retrieved {len(results)} stock records from database")
        return results
    except Error as e:
        logger.error(f"Database error: {e}")
        return []
    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()
        if conn:
            conn.close()
        logger.info("Database connection closed")

def insert_stock(data):
    """
    Insert a new stock record into the 'stocks' table.
    Expects a JSON payload with the following fields:
        - symbol: Stock symbol (string)
        - action: Action type ('buy' or 'sell') (string)
        - quantity: Quantity of the stock (integer)
        - purchase_price: Optional. If not provided, current price is fetched automatically.
    """
    logger.info(f"Starting insert_stock function with data: {data}")
    
    required_fields = ['symbol', 'action', 'quantity']
    if not all(field in data for field in required_fields):
        missing = [field for field in required_fields if field not in data]
        logger.error(f"Missing required fields: {missing}")
        return jsonify({"error": "Missing required fields"}), 400

    if len(data['symbol']) > 10:
        logger.error(f"Symbol too long: {data['symbol']}")
        return jsonify({"error": "Symbol must be 10 characters or less"}), 400
    
    if data['action'] not in ['buy', 'sell']:
        logger.error(f"Invalid action: {data['action']}")
        return jsonify({"error": "Action must be either 'buy' or 'sell"}), 400

    # Auto-fetch price if not provided (after required field validation)
    if 'purchase_price' not in data:
        logger.info(f"No purchase price provided for {data['symbol']}, fetching from Yahoo Finance")
        try:
            ticker = yf.Ticker(data['symbol'])
            logger.info(f"Retrieving history for {data['symbol']}")
            current_data = ticker.history(period="1d")
            
            if current_data.empty:
                logger.error(f"Empty data returned for {data['symbol']}")
                return jsonify({"error": f"Could not fetch current price for {data['symbol']}"}), 400
                
            current_price = float(current_data['Close'].iloc[-1])
            data['purchase_price'] = current_price
            logger.info(f"Successfully fetched current price for {data['symbol']}: {current_price}")
        except Exception as e:
            logger.error(f"Error fetching current price for {data['symbol']}: {e}")
            return jsonify({"error": f"Failed to fetch current price: {str(e)}"}), 500
    else:
        logger.info(f"Using provided purchase price: {data['purchase_price']}")
        
    success, error_message = insert_stock_record(data)
    if not success:
        logger.error(f"Error inserting stock: {error_message}")
        return jsonify({"error": error_message}), 500
        
    logger.info(f"Getting stock name for {data['symbol']}")
    name = get_stock_name_from_ticker(data['symbol'])
    if not name:
        logger.error(f"Could not retrieve name for {data['symbol']}")
        raise ValueError(f"Could not retrieve name for {data['symbol']}")
        
    logger.info(f"Inserting symbol-name pair: {data['symbol']} - {name}")
    insert_stock_symbol_pair_if_not_exists(data['symbol'], name)
    
    price_source = "user_provided" if 'purchase_price' in request.get_json() else "yahoo_finance"
    logger.info(f"Stock inserted successfully. Price source: {price_source}")
    return jsonify({
        "message": "Stock inserted successfully",
        "used_price": data['purchase_price'],
        "price_source": price_source
    }), 201

def insert_stock_record(data):
    """
    Repository function to insert a stock record into the database.
    Params:
        data: Dictionary containing stock data
    Returns:
        Tuple (success, error_message)
    """
    logger.info("Connecting to database for stock insertion")
    conn = get_db_connection()
    if conn is None:
        logger.error("Database connection failed")
        return False, "Database connection failed"
    
    try:
        logger.info("Creating database cursor")
        cursor = conn.cursor()
        query = """
            INSERT INTO portfolio (symbol, purchase_price, action, quantity)
            VALUES (%s, %s, %s, %s)
        """
        values = (
            data['symbol'],
            data['purchase_price'],
            data['action'],
            data['quantity']
        )
        logger.info(f"Executing insert query with values: {values}")
        cursor.execute(query, values)
        conn.commit()
        name = get_stock_name_from_ticker(data['symbol'])
        if not name:
            raise ValueError(f"Could not retrieve name for {data['symbol']}")
        insert_stock_symbol_pair_if_not_exists(data['symbol'], name)
        
        return jsonify({
            "message": "Stock inserted successfully",
            "used_price": data['purchase_price'],
            "price_source": "user_provided" if 'purchase_price' in data else "yahoo_finance"
        }), 201

    except Error as e:
        logger.error(f"Error inserting stock: {e}")
        return False, str(e)
    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()
        if conn:
            conn.close()
        logger.info("Database connection closed")

def insert_stock_symbol_pair_if_not_exists(ticker, name):
    """
    Repository function to insert a stock symbol and name into the master table.
    Only inserts if the symbol doesn't already exist.
    """
    logger.info(f"Starting insert_stock_symbol_pair for {ticker} - {name}")
    conn = get_db_connection()
    if conn is None:
        logger.error("Database connection failed")
        return False
    
    try:
        cursor = conn.cursor(dictionary=True)
        
        # Check if symbol already exists
        check_query = "SELECT symbol FROM portfolio_master WHERE symbol = %s"
        cursor.execute(check_query, (ticker,))
        existing = cursor.fetchone()
        
        if existing:
            logger.info(f"Symbol {ticker} already exists in master table, skipping insert")
            return True
            
        # Insert new symbol-name pair
        insert_query = """
            INSERT INTO portfolio_master (symbol, name)
            VALUES (%s, %s)
        """
        values = (ticker, name)
        logger.info(f"Executing insert query for stock master with values: {values}")
        cursor.execute(insert_query, values)
        conn.commit()
        logger.info("Stock master table updated successfully")
        return True
    except Error as e:
        logger.error(f"Failed to update Stock Master table: {e}")
        return False
    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()
        if conn:
            conn.close()
        logger.info("Closing database connections")

def get_stock_name_from_ticker(ticker):
    logger.info(f"Fetching stock name for ticker: {ticker}")
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        name = info.get("shortName", None)
        if name:
            logger.info(f"Retrieved name for {ticker}: {name}")
        else:
            logger.warning(f"Could not find name for {ticker}")
        return name
    except Exception as e:
        logger.error(f"Error retrieving stock name for {ticker}: {e}")
        return None
