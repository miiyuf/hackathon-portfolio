from app.main.service.getrealprice import get_real_price
from app.main.repository.fetchholding import fetch_holdings
from flask import Blueprint, request, jsonify
from decimal import Decimal, InvalidOperation
from flask import current_app as app
import logging
logger = logging.getLogger(__name__)

portfolio_bp = Blueprint('portfolio', __name__, url_prefix='/api')

@portfolio_bp.route('/portfolio', methods=['GET'])
def get_portfolio():
    """
    Get portfolio information with detailed holdings.
    
    Returns a JSON object containing:
    - total_net_investment: Total portfolio value based on investment history (total_buy_value - total_sell_value)
    - holdings: List of stock holdings with detailed information
    
    Each holding contains:
    - symbol: Stock ticker symbol
    - name: Company name (if available)
    - total_quantity: Current quantity of shares held
    - total_buy_value: Total amount spent on purchases
    - total_sell_value: Total amount received from sales
    - net_investment: Net amount invested (total_buy_value - total_sell_value)
    - current_price: Current market price per share (if available)
    - market_value: Total current market value (current_price * total_quantity)
    - unrealized_profit_loss: Unrealized profit/loss (market_value - net_investment)
    """
    # Function Entry Log
    app.logger.info("Received request for GET /api/portfolio.")
    
    holdings = fetch_holdings()
    # After DB Fetch Log
    app.logger.info(f"Fetched {len(holdings)} unique holdings from the database.")
    
    detailed_holdings = []
    total_portfolio_value = Decimal('0.0')

    for holding in holdings:
        symbol = holding['symbol']
        # Inside Loop Log
        app.logger.info(f"Processing symbol: {symbol}...")
        
        # Fetch current price for display purposes
        current_price = get_real_price(symbol)
        
        # Calculate portfolio value based on transaction history
        total_buy_value = Decimal(str(holding['total_buy_value']))
        total_sell_value = Decimal(str(holding['total_sell_value']))
        
        # Net investment = Total amount spent on purchases - Total amount received from sales
        net_investment = total_buy_value - total_sell_value
        
        # Add to portfolio total value
        total_portfolio_value += net_investment
        
        app.logger.debug(f"Symbol: {symbol}, Buy Value: {total_buy_value}, Sell Value: {total_sell_value}")
        app.logger.info(f"Net Investment for {symbol}: {net_investment}")
        
        # Data Formatting
        holding['total_buy_value'] = str(total_buy_value)
        holding['total_sell_value'] = str(total_sell_value)
        
        # Only use net_investment
        holding['net_investment'] = str(net_investment)
        
        # Add current market data if available
        if current_price is not None:
            app.logger.info(f"Successfully fetched price for {symbol}: {current_price}")
            current_price_decimal = Decimal(str(current_price))
            holding['current_price'] = str(current_price_decimal)
            
            # Calculate current market value
            market_value = current_price_decimal * Decimal(str(holding['total_quantity']))
            holding['market_value'] = str(market_value)
            
            # Calculate unrealized profit/loss
            unrealized_pl = market_value - net_investment
            holding['unrealized_profit_loss'] = str(unrealized_pl)
        else:
            app.logger.warning(f"Failed to fetch current price for {symbol}.")
            holding['current_price'] = None
            holding['market_value'] = None
            holding['unrealized_profit_loss'] = None
            
        detailed_holdings.append(holding)

    # Final Summary Log
    app.logger.info(f"Final calculated portfolio total value (based on purchase history): {total_portfolio_value}")

    # Response Object Creation
    response_data = {
        'total_net_investment': str(total_portfolio_value),
        'holdings': detailed_holdings
    }
    app.logger.info("Sending final portfolio response.")

    return jsonify(response_data)