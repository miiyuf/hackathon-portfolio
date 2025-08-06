from app.main.service.getrealprice import get_real_price
from app.main.repository.fetchholding import fetch_holdings
from decimal import Decimal, InvalidOperation
import logging
import time
logger = logging.getLogger(__name__)

def get_portfolio():
    """
    Get portfolio information with detailed holdings.
    
    Returns a JSON object containing:
    - total_net_investment: Total portfolio value based on investment history
    - total_portfolio_balance: Total current market value of all holdings
    - holdings: List of stock holdings with detailed information
    """
    logger.info("Starting get_portfolio service function.")
    
    holdings = fetch_holdings()
    logger.info(f"Fetched {len(holdings)} unique holdings from the database.")
    
    detailed_holdings = []
    total_net_investment = Decimal('0.0')  # Total amount of funds invested (net investment)
    total_portfolio_balance = Decimal('0.0')  # Total current market value of holdings
    success_price_fetch_count = 0  # Counter for successful price fetches

    for holding in holdings:
        symbol = holding['symbol']
        logger.info(f"Processing symbol: {symbol}...")
        
        # Fetch current price for display purposes
        current_price = get_real_price(symbol)
        
        
        # Calculate portfolio value based on transaction history
        total_buy_value = Decimal(str(holding['total_buy_value']))
        total_sell_value = Decimal(str(holding['total_sell_value']))
        total_quantity = Decimal(str(holding['total_quantity']))
        
        # Net investment = Total amount spent on purchases - Total amount received from sales
        net_investment = total_buy_value - total_sell_value
        
        # Add to portfolio total investment
        total_net_investment += net_investment
        
        logger.debug(f"Symbol: {symbol}, Buy Value: {total_buy_value}, Sell Value: {total_sell_value}")
        logger.info(f"Net Investment for {symbol}: {net_investment}")
        
        # Data Formatting
        holding['total_buy_value'] = str(total_buy_value)
        holding['total_sell_value'] = str(total_sell_value)
        
        # Only use net_investment
        holding['net_investment'] = str(net_investment)
        
        # Add current market data if available
        if current_price is not None:
            logger.info(f"Successfully fetched price for {symbol}: {current_price} in {price_fetch_time:.2f}s")
            success_price_fetch_count += 1
            current_price_decimal = Decimal(str(current_price))
            holding['current_price'] = str(current_price_decimal)
            
            # Calculate current market value
            market_value = current_price_decimal * total_quantity
            holding['market_value'] = str(market_value)
            
            # Add current market value to total balance
            total_portfolio_balance += market_value
            
            
            # Calculate unrealized profit/loss
            unrealized_pl = market_value - net_investment
            holding['unrealized_profit_loss'] = str(unrealized_pl)
        else:
            logger.warning(f"Failed to fetch current price for {symbol}.")
            holding['current_price'] = None
            holding['market_value'] = None
            holding['unrealized_profit_loss'] = None
            
        detailed_holdings.append(holding)

    # Final Summary Log
    logger.info(f"Final calculated portfolio net investment: {total_net_investment}")
    logger.info(f"Final calculated portfolio current balance: {total_portfolio_balance}")

    # Response Object Creation
    response_data = {
        'total_net_investment': str(total_net_investment),
        'total_portfolio_balance': str(total_portfolio_balance),
        'holdings': detailed_holdings
    }
    logger.info("Portfolio data preparation completed.")

    # Add before final response
    logger.info(f"Final response data - Net Investment: {response_data['total_net_investment']}, " +
               f"Portfolio Balance: {response_data['total_portfolio_balance']}")

    return response_data