from app.main.repository import holding, stock, transaction, update
import yfinance as yf
import logging
import time

logger = logging.getLogger(__name__)

def get_stocks():
    """Get all stocks from the database"""
    logger.info("Starting get_stocks() service function")
    start_time = time.time()
    
    results = stock.get_stocks()
    
    logger.info(f"get_stocks() completed in {time.time() - start_time:.2f}s - Retrieved {len(results)} records")
    return results

def get_holdings():
    """Get all holdings from the database"""
    logger.info("Starting get_holdings() service function")
    start_time = time.time()
    
    results = holding.get_holdings()
    
    logger.info(f"get_holdings() completed in {time.time() - start_time:.2f}s")
    return results

def insert_stock(data):
    """
    Business logic for inserting a stock
    - Validates business rules
    - Auto-fetches price if needed
    - Calls repository layer to perform database operations
    """
    logger.info(f"Starting insert_stock service with data: {data}")
    start_time = time.time()
    
    # Detailed validation (business rules)
    logger.debug("Validating symbol length")
    if len(data['symbol']) > 10:
        logger.error(f"Symbol too long: {data['symbol']} (length: {len(data['symbol'])})")
        return {"error": "Symbol must be 10 characters or less"}, 400
    
    logger.debug("Validating action type")
    if data['action'] not in ['buy', 'sell']:
        logger.error(f"Invalid action: {data['action']}")
        return {"error": "Action must be either 'buy' or 'sell'"}, 400

    price_source = "user_provided"
    logger.debug(f"Initial price_source: {price_source}")

    # Auto-fetch price if not provided (business logic)
    if 'purchase_price' not in data:
        logger.info(f"No purchase price provided for {data['symbol']}, fetching from Yahoo Finance")
        yahoo_start_time = time.time()
        try:
            logger.debug(f"Creating Yahoo Finance ticker for {data['symbol']}")
            ticker = yf.Ticker(data['symbol'])
            logger.debug(f"Fetching history for {data['symbol']}")
            current_data = ticker.history(period="1d")
            
            if current_data.empty:
                logger.error(f"Empty data returned for {data['symbol']} from Yahoo Finance")
                return {"error": f"Could not fetch current price for {data['symbol']}"}, 400
                
            current_price = float(current_data['Close'].iloc[-1])
            data['purchase_price'] = current_price
            logger.info(f"Successfully fetched current price for {data['symbol']}: {current_price} in {time.time() - yahoo_start_time:.2f}s")
            price_source = "yahoo_finance"
            logger.debug(f"Updated price_source to: {price_source}")
        except Exception as e:
            logger.error(f"Error fetching current price for {data['symbol']}: {e}", exc_info=True)
            return {"error": f"Failed to fetch current price: {str(e)}"}, 500
    else:
        logger.info(f"Using provided purchase price: {data['purchase_price']} for {data['symbol']}")

    # Get stock name (business logic)
    logger.debug(f"Fetching stock name for {data['symbol']}")
    name_start_time = time.time()
    try:
        name = get_stock_name_from_ticker(data['symbol'])
        if not name:
            logger.warning(f"Could not retrieve name for {data['symbol']}, using symbol as name")
            name = data['symbol']
        else:
            logger.info(f"Successfully retrieved name for {data['symbol']}: '{name}' in {time.time() - name_start_time:.2f}s")
    except Exception as e:
        logger.error(f"Error retrieving stock name for {data['symbol']}: {e}", exc_info=True)
        name = data['symbol']  # Fallback to symbol if name retrieval fails
        logger.info(f"Using symbol as name fallback: {name}")
    
    # Call repository layer
    # NOTE: All validation is performed in the service layer above.
    # The repository layer (insert_stock_record) should not duplicate validation logic.
    logger.debug(f"Calling repository layer to insert stock record for {data['symbol']}")
    db_start_time = time.time()
    success, db_error = stock.insert_stock_record(data)
    if not success:
        logger.error(f"Database error while inserting stock {data['symbol']}: {db_error}")
        return {"error": f"Database error: {db_error}"}, 500
    logger.info(f"Successfully inserted stock record in {time.time() - db_start_time:.2f}s")
        
    # Insert into master table if needed
    logger.debug(f"Inserting symbol-name pair into master table: {data['symbol']} - {name}")
    master_start_time = time.time()
    master_result = stock.insert_stock_symbol_pair_if_not_exists(data['symbol'], name)
    if master_result:
        logger.info(f"Symbol-name pair inserted or already exists in master table in {time.time() - master_start_time:.2f}s")
    else:
        logger.warning(f"Failed to insert symbol-name pair into master table: {data['symbol']} - {name}")
    
    # Return success response
    total_time = time.time() - start_time
    logger.info(f"Stock insertion completed successfully in {total_time:.2f}s - Symbol: {data['symbol']}, Price: {data['purchase_price']}, Source: {price_source}")
    return {
        "message": "Stock inserted successfully",
        "used_price": data['purchase_price'],
        "price_source": price_source,
        "processing_time_ms": int(total_time * 1000)
    }, 201

def get_transactions():
    """Get all transactions from the database"""
    logger.info("Starting get_transactions() service function")
    start_time = time.time()
    
    results = transaction.get_transactions()
    logger.info(f"get_transactions() completed in {time.time() - start_time:.2f}s") # Retrieved {len(results)} transactions")
    return results

def update_current_prices():
    """Update current prices in the database"""
    logger.info("Starting scheduled update_current_prices() service function")
    start_time = time.time()
    
    result = update.update_current_prices()
    
    logger.info(f"update_current_prices() completed in {time.time() - start_time:.2f}s")
    return result

def get_stock_name_from_ticker(ticker):
    """Get stock name from ticker symbol using Yahoo Finance"""
    logger.info(f"Fetching stock name for ticker: {ticker}")
    start_time = time.time()
    
    try:
        logger.debug(f"Creating Yahoo Finance ticker for {ticker}")
        stock_obj = yf.Ticker(ticker)
        
        logger.debug(f"Retrieving info for {ticker}")
        info = stock_obj.info
        
        name = info.get("shortName", None)
        if name:
            logger.info(f"Retrieved name for {ticker}: '{name}' in {time.time() - start_time:.2f}s")
        else:
            logger.warning(f"Could not find name for {ticker} in {time.time() - start_time:.2f}s")
        return name
    except Exception as e:
        logger.error(f"Error retrieving stock name for {ticker}: {e}", exc_info=True)
        logger.info(f"Name retrieval failed in {time.time() - start_time:.2f}s")
        return None