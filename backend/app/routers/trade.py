# If you want to use FastAPI, uncomment the following lines

# from fastapi import APIRouter, HTTPException
# from pydantic import BaseModel

# router = APIRouter()

# class TradeRequest(BaseModel):
#     ticker: str
#     action: str
#     quantity: int
#     price: float

# @router.post("/trade")
# def get_trade_info(trade: TradeRequest):
#     print(f"Ticker: {trade.ticker}, Action: {trade.action}, Quantity: {trade.quantity}, Price: {trade.price}")

#     return {"message": "Trade received"}


from flask import Blueprint, request, jsonify

trade_bp = Blueprint('trade', __name__, url_prefix='/trade')

@trade_bp.route('', methods=['POST'])  
def get_trade_info():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    ticker = data.get("ticker")
    action = data.get("action")
    quantity = data.get("quantity")
    price = data.get("price")

    print(f"Ticker: {ticker}, Action: {action}, Quantity: {quantity}, Price: {price}")

    return jsonify({"message": "Trade received"})
