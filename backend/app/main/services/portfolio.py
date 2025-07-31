from app.main.bussinesslogic.calc_portfolio import fetch_holdings, get_real_price
from flask import Blueprint, request, jsonify
from decimal import Decimal, InvalidOperation

portfolio_bp = Blueprint('portfolio', __name__, url_prefix='/api')

@portfolio_bp.route('/portfolio', methods=['GET'])
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
        current_price = Decimal(str(current_price))
        if current_price is not None:
            holding['current_price'] = current_price
            holding['total_value'] = current_price * holding['total_quantity']
        else:
            holding['current_price'] = None
            holding['total_value'] = None
        portfolio.append(holding)

    return jsonify(portfolio)