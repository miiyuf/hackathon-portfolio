from app.main.bussinesslogic.calc_portfolio import get_real_price
from flask import Blueprint, request, jsonify

price_bp = Blueprint('price', __name__, url_prefix='/api')

@price_bp.route('/price/<symbol>', methods=['GET'])
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
