
# if you are using FastAPI, the following code is for a stock information endpoint.

# import yfinance as yf
# from fastapi import APIRouter

# router = APIRouter()

# # curl  http://0.0.0.0:5000/get_stock_info

# @router.get("/stock")
# def get_stock_info(ticker: str = "AAPL"):

#     Stock = yf.Ticker(ticker=ticker)  

#     Stock_info = Stock.info

#     company_name = Stock_info.get('longName', 'N/A')
#     current_price = Stock_info.get('currentPrice', 'N/A')

    
#     return {
#         "Company ID": ticker,
#         "Company Name": company_name,
#         "Current Price": current_price,
#     }

from flask import Blueprint, jsonify, request
import yfinance as yf

stock_bp = Blueprint('stock', __name__, url_prefix='/stock')

@stock_bp.route('', methods=['GET'])
def get_stock_info():
    ticker = request.args.get("ticker", "AAPL")  

    stock = yf.Ticker(ticker)
    stock_info = stock.info

    company_name = stock_info.get('longName', 'N/A')
    current_price = stock_info.get('currentPrice', 'N/A')

    return jsonify({
        "Company ID": ticker,
        "Company Name": company_name,
        "Current Price": current_price
    })
