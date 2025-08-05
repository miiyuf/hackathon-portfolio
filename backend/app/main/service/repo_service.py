from app.main.repository import holding, stock, transaction, update
import yfinance as yf
import logging

logger = logging.getLogger(__name__)

def get_stocks():
    """Get all stocks from the database"""
    return stock.get_stocks()

def get_holdings():
    """Get all holdings from the database"""
    return holding.get_holdings()

def insert_stock(data):
    """
    Business logic for inserting a stock
    - Validates business rules
    - Auto-fetches price if needed
    - Calls repository layer to perform database operations
    """
    # Detailed validation (business rules)
    if len(data['symbol']) > 10:
        logger.error(f"Symbol too long: {data['symbol']}")
        return {"error": "Symbol must be 10 characters or less"}, 400
    
    if data['action'] not in ['buy', 'sell']:
        logger.error(f"Invalid action: {data['action']}")
        return {"error": "Action must be either 'buy' or 'sell'"}, 400

    # Auto-fetch price if not provided (business logic)
    if 'purchase_price' not in data:
        logger.info(f"No purchase price provided for {data['symbol']}, fetching from Yahoo Finance")
        try:
            ticker = yf.Ticker(data['symbol'])
            current_data = ticker.history(period="1d")
            
            if current_data.empty:
                logger.error(f"Empty data returned for {data['symbol']}")
                return {"error": f"Could not fetch current price for {data['symbol']}"}, 400
                
            current_price = float(current_data['Close'].iloc[-1])
            data['purchase_price'] = current_price
            logger.info(f"Successfully fetched current price for {data['symbol']}: {current_price}")
            price_source = "yahoo_finance"
        except Exception as e:
            logger.error(f"Error fetching current price for {data['symbol']}: {e}")
            return {"error": f"Failed to fetch current price: {str(e)}"}, 500
    else:
        price_source = "user_provided"
        logger.info(f"Using provided purchase price: {data['purchase_price']}")

    # Get stock name (business logic)
    try:
        name = get_stock_name_from_ticker(data['symbol'])
        if not name:
            logger.warning(f"Could not retrieve name for {data['symbol']}, using symbol as name")
            name = data['symbol']
    except Exception as e:
        logger.error(f"Error retrieving stock name: {e}")
        name = data['symbol']  # Fallback to symbol if name retrieval fails
    
    # Call repository layer
    success, db_error = stock.insert_stock_record(data)
    if not success:
        return {"error": f"Database error: {db_error}"}, 500
        
    # Insert into master table if needed
    stock.insert_stock_symbol_pair_if_not_exists(data['symbol'], name)
    
    # Return success response
    return {
        "message": "Stock inserted successfully",
        "used_price": data['purchase_price'],
        "price_source": price_source
    }, 201

def get_transactions():
    """Get all transactions from the database"""
    return transaction.get_transactions()

def update_current_prices():
    """Update current prices in the database"""
    return update.update_current_prices()

def get_stock_name_from_ticker(ticker):
    """Get stock name from ticker symbol using Yahoo Finance"""
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