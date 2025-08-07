from app.main.service.getrealprice import get_real_price
from flask import Blueprint, request, jsonify
from app.main.service.getrealprice import get_long_term_price
from app.main.service.repo_service import get_holdings
import numpy as np
import logging
logger = logging.getLogger(__name__)
from datetime import date, timedelta

# price_bp = Blueprint('price', __name__, url_prefix='/api')

# @price_bp.route('/price/<symbol>', methods=['GET'])
def get_stock_price(symbol):
    """
    Retrieve the real-time price of a stock using its symbol.
    Args:
        symbol (str): Stock symbol passed as a URL parameter.
    Returns:
        JSON response with the current price or an error message if the price cannot be fetched.
    """
    price = get_real_price(symbol)
    if price is None:
        return jsonify({"error": f"Could not fetch price for symbol: {symbol}"}), 500
    return jsonify({"symbol": symbol, "price": price})

def get_long_stock_price(symbol):
    """

    """
    price = get_long_term_price(symbol,days=10)
    if price is None:
        return jsonify({"error": f"Could not fetch long-term price for symbol: {symbol}"}), 500
    return jsonify({"symbol": symbol, "long_term_price": price})

def get_long_term_balance(days=10):
    """

    """

    get_long_term_balances = [0] * days
    # get "current prices" for each holding 
    cur_prices_all = {}
        
    for day in range(days):
        end_date = str(date.today() - timedelta(days=days-day)) # day 0 is 'days' days ago
        holdings = get_holdings(end_date) # get state of holdings up until day
        total_cost_price = 0
        logger.info(holdings)
        for holding in holdings: 
            
            logging.info(f"Processing holding: {holding}")
            cost_price = holding.get('cost_price',0)
            quantity = holding.get('total_quantity', 0)


            cur_prices = cur_prices_all.get(holding['symbol'], get_long_term_price(holding.get('symbol'), days))
            cur_price = cur_prices[day]


            profitloss = (float(cur_price) - float(cost_price)) * float(quantity)
            logger.info(f"cur_price: {cur_price}, cost_price: {cost_price}, quantity: {quantity}, profitloss: {profitloss}, day: {day} before symbol: {holding['symbol']}")            
            
            total_cost_price += float(cost_price) * float(quantity)
            get_long_term_balances[day] += profitloss


        logger.info(f"total_cost_price: {total_cost_price}, long_term_balance: {get_long_term_balances[day]}, day: {day}")   
        if total_cost_price == 0:
            percentage = 0
        else:
            percentage = get_long_term_balances[day]/total_cost_price * 100
        get_long_term_balances[day] = percentage
            
    
    
    # holdings = get_holdings()
    # for holding in holdings:
    #     cost_price = holding.get('cost_price')
    #     symbol = holding.get('symbol')
    #     # quantity = holding.get('quantity', 0)
    #     # logger.info(quantity)
    #     prices = get_long_term_price(symbol,days=10)
    #     balances_per_symbol = np.array(prices) * quantity
    #     get_long_term_balances.append(balances_per_symbol)
    
    # get_long_term_balance = np.sum(get_long_term_balances, axis=0).tolist()

    return jsonify({"long_term_balance": get_long_term_balances}), 200