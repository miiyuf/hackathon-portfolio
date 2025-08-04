from flask import Blueprint, jsonify
from app.main.bussinesslogic.calc_portfolio import get_real_price, fetch_holdings
import logging
from decimal import Decimal, InvalidOperation
import sys
import os

# Setup logging with environment-based configuration
logger = logging.getLogger(__name__)
log_level = os.environ.get("LOG_LEVEL", "INFO").upper()
logger.setLevel(getattr(logging, log_level, logging.INFO))

if not logger.handlers:
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
    logger.addHandler(handler)

profitloss_bp = Blueprint('profit_loss', __name__, url_prefix='/api')

@profitloss_bp.route('/profit_loss', methods=['GET'])
def get_profit_loss():
    """
    Calculate profit/loss for each holding.
    
    Returns a list of holdings with profit/loss information.
    """
    logger.info("=== Starting profit_loss calculation ===")
    
    # Fetch holdings without purchase_price parameter (it's not implemented correctly)
    holdings = fetch_holdings()
    logger.info(f"Fetched {len(holdings) if holdings else 0} holdings from database")
    logger.debug(f"Raw holdings data: {holdings}")
    profit_loss_data = []

    if not holdings:
        logger.error("No holdings found or database connection failed")
        return jsonify({"error": "No holdings found or database connection failed"}), 500

    for idx, holding in enumerate(holdings):
        logger.info(f"=== Processing holding {idx+1}/{len(holdings)} ===")
        symbol = holding.get('symbol', 'Unknown')
        logger.info(f"Processing symbol: {symbol}")
        logger.debug(f"Raw holding data: {holding}")
        
        # Calculate average purchase price (similar to portfolio.py)
        try:
            total_buy_value = Decimal(str(holding.get('total_buy_value', '0')))
            total_quantity = Decimal(str(holding.get('total_quantity', '0')))
            
            # Check if required fields exist
            if 'total_buy_value' not in holding or 'total_quantity' not in holding:
                logger.error(f"Missing required fields for {symbol}")
                holding['current_price'] = None
                holding['profit_loss'] = None
                profit_loss_data.append(holding)
                continue
                
            # Calculate average purchase price
            if total_quantity > 0:
                avg_purchase_price = total_buy_value / total_quantity
                logger.debug(f"Calculated average purchase price for {symbol}: {avg_purchase_price}")
            else:
                logger.error(f"Invalid quantity for {symbol}: {total_quantity}")
                holding['current_price'] = None
                holding['profit_loss'] = None
                profit_loss_data.append(holding)
                continue
            
            # Fetch current price (same as portfolio.py)
            logger.info(f"Fetching current price for {symbol}")
            current_price = get_real_price(symbol)
            logger.info(f"Received price for {symbol}: {current_price} (type: {type(current_price)})")

            if current_price is not None:
                # Convert to Decimal for accurate calculations
                current_price_decimal = Decimal(str(current_price))
                
                # Calculate profit/loss
                price_diff = current_price_decimal - avg_purchase_price
                profit_loss = price_diff * total_quantity
                
                logger.debug(f"Price difference per share: {current_price_decimal} - {avg_purchase_price} = {price_diff}")
                logger.debug(f"Total profit/loss calculation: {price_diff} * {total_quantity} = {profit_loss}")
                
                # Convert results to float for JSON serialization
                current_price_float = float(current_price_decimal)
                profit_loss_float = float(profit_loss)
                
                # Save results
                holding['current_price'] = current_price_float
                holding['profit_loss'] = profit_loss_float
                
                # Log final results
                percent_change = (price_diff / avg_purchase_price) * 100 if avg_purchase_price > 0 else 0
                logger.info(f"Results for {symbol}: Purchase: ${avg_purchase_price}, Current: ${current_price_decimal}, " +
                           f"Change: {percent_change:.2f}%, Quantity: {total_quantity}, Profit/Loss: ${profit_loss}")
            else:
                logger.warning(f"Current price not found for {symbol}, cannot calculate profit/loss")
                holding['current_price'] = None
                holding['profit_loss'] = None
                
        except (KeyError, TypeError, ValueError, InvalidOperation, ZeroDivisionError) as e:
            logger.error(f"Error calculating profit/loss for {symbol}: {e}")
            logger.error(f"Error details - Type: {type(e).__name__}, Args: {e.args}")
            holding['current_price'] = None
            holding['profit_loss'] = None
            
        profit_loss_data.append(holding)
        logger.info(f"Completed processing for {symbol}")

    logger.info("=== Finished profit_loss calculations ===")
    logger.debug(f"Final profit_loss_data (length: {len(profit_loss_data)}): {profit_loss_data}")

    return jsonify(profit_loss_data)
