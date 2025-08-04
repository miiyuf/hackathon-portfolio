from app.main.service.calc_portfolio import get_real_price
from flask import Blueprint, request, jsonify

def get_stock_price(symbol):
    """
    Retrieve the real-time price of a stock using its symbol.
    Args:
        symbol (str): Stock symbol passed as a URL parameter.
    Returns:
        JSON response with the current price or an error message if the price cannot be fetched.
    """
    price = get_real_price(symbol)
    return price

