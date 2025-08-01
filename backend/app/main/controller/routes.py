from flask import Blueprint, request, jsonify
from app.main.service import repo_service
from app.main.service import price as Price
from app.main.service import profit_loss
from app.main.service import portfolio

stockget_bp = Blueprint('get_stocks', __name__, url_prefix='/api')
@stockget_bp.route('/stocks', methods=['GET'])
def get_stocks():
    result = repo_service.get_stocks()
    if not result:
        return jsonify({"error": "No stocks found"}), 404
    return jsonify(result)

price_bp = Blueprint('price', __name__, url_prefix='/api')

@price_bp.route('/price/<symbol>', methods=['GET'])
def get_stock_price(symbol):
    price = Price.get_stock_price(symbol)
    if price is None:
        return jsonify({"error": f"Could not fetch price for symbol: {symbol}"}), 500
    return jsonify({"symbol": symbol, "price": price})

holdings_bp = Blueprint('holdings', __name__, url_prefix='/api')

@holdings_bp.route('/holdings', methods=['GET'])
def get_holdings():
    result = repo_service.get_holdings()
    if not result:
        return jsonify({"error": "No holdings found"}), 404
    return jsonify(result)

stockinsert_bp = Blueprint('insert_stocks', __name__, url_prefix='/api')

@stockinsert_bp.route('/stocks', methods=['POST'])  
def insert_stock():
    data = request.get_json()

    required_fields = ['symbol', 'purchase_price', 'action', 'quantity']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400
    
    result = repo_service.insert_stock(data)
    return result

transaction_bp = Blueprint('transaction', __name__, url_prefix='/api')

@transaction_bp.route('/transaction', methods=['GET'])
def get_transactions():
    result = repo_service.get_transactions()
    if not result:
        return jsonify({"error": "No transactions found"}), 404
    return jsonify(result)


profitloss_bp = Blueprint('profit_loss', __name__, url_prefix='/api')

@profitloss_bp.route('/profit_loss', methods=['GET'])
def get_profit_loss():
    result = profit_loss.get_profit_loss()
    if not result:
        return jsonify({"error": "No profit/loss data found"}), 404
    return jsonify(result)

portfolio_bp = Blueprint('portfolio', __name__, url_prefix='/api')

@portfolio_bp.route('/portfolio', methods=['GET'])
def get_portfolio():
    result = portfolio.get_portfolio()
    if not result:
        return jsonify({"error": "No portfolio data found"}), 404
    return jsonify(result)


