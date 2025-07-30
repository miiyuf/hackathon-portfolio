
from flask import Blueprint, request, jsonify
from app.main.bussinesslogic.calc_portfolio import get_real_price, fetch_holdings

portfolioloss_bp = Blueprint('portfolio_loss', __name__, url_prefix='/api')

@portfolioloss_bp.route('/portfolio_loss', methods=['GET'])
def get_profit_loss():
    """
    Calculate the profit or loss for each holding based on the current price and purchase price.
    Returns:
        JSON response with the profit/loss details for each holding or an error message if the DB connection fails.
    """
    holdings = fetch_holdings(include_purchase_price=True)
    profit_loss_data = []
    for holding in holdings:
        symbol = holding['symbol']
        current_price = get_real_price(symbol)
        if current_price is not None:
            profit_loss = (current_price - holding['purchase_price']) * holding['total_quantity']
            holding['current_price'] = current_price
            holding['profit_loss'] = profit_loss
        else:
            holding['current_price'] = None
            holding['profit_loss'] = None
        profit_loss_data.append(holding)

    return jsonify(profit_loss_data)
