from app.main.service.getrealprice import get_real_price
from flask import Blueprint, request, jsonify
from app.main.service.getrealprice import get_long_term_price
from app.main.service.repo_service import get_holdings
import numpy as np

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

def get_long_term_balance():
    """

    """

    get_long_term_balances = []
    
    holdings = get_holdings()
    for holding in holdings:
        symbol = holding.get('symbol')
        quantity = holding.get('quantity', 0)
        prices = get_long_term_price(symbol,days=10)
        balances_per_symbol = np.array(prices) * quantity
        get_long_term_balances.append(balances_per_symbol)
    
    get_long_term_balance = np.sum(get_long_term_balances, axis=0).tolist()

    return jsonify({"long_term_balance": get_long_term_balance}), 200