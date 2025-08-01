
from flask import Blueprint, request, jsonify
from app.main.businesslogic.calc_portfolio import get_real_price, fetch_holdings
import logging
from decimal import Decimal, InvalidOperation

logger = logging.getLogger(__name__)

profitloss_bp = Blueprint('profit_loss', __name__, url_prefix='/api')

def get_profit_loss():
    holdings = fetch_holdings(include_purchase_price=True)
    profit_loss_data = []

    if not holdings:
        return jsonify({"error": "No holdings found or database connection failed"}), 500

    for holding in holdings:
        symbol = holding.get('symbol', 'Unknown')
        current_price = get_real_price(symbol)

        if current_price is not None:
            try:
                current_price = Decimal(str(current_price))
                purchase_price = Decimal(str(holding['purchase_price']))
                quantity = Decimal(str(holding.get('total_quantity', '0')))

                profit_loss = (current_price - purchase_price) * quantity
            except (KeyError, TypeError, ValueError, InvalidOperation) as e:
                logger.error(f"Error calculating profit/loss for {symbol}: {e}")
                
                profit_loss = None
                holding['current_price'] = Decimal(str(current_price))
                holding['profit_loss'] = Decimal(str(profit_loss)) if profit_loss is not None else None
        else:
            logger.warning(f"Current price not found for {symbol}")
            holding['current_price'] = None
            holding['profit_loss'] = None

        profit_loss_data.append(holding)

    return profit_loss_data
