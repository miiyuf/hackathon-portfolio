from flask import Blueprint, request, jsonify
from app.main.service import repo_service
from app.main.service import price as Price
from app.main.service import profit_loss
from app.main.service import portfolio
import yfinance as yf
import time
import logging
import numpy as np
import pandas as pd
import os
import sys

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG)

cached_top_stocks = []
last_update_time = 0

TOP_SYMBOLS = [
    'AAPL', 'MSFT', 'AMZN', 'GOOGL', 'META', 
    'TSLA', 'NVDA', 'JPM', 'V', 'WMT'
]

JAPAN_SYMBOLS = [] 
cached_japan_stocks = []
japan_last_update_time = 0

def load_japan_symbols():
    logger.info("=== ENTERING load_japan_symbols ===") 
    logger.warning("=== Entering load_japan_symbols ===")
    try:
        csv_path = os.path.join(os.path.dirname(__file__), 'data_j.csv')
        logger.warning(f"Looking for CSV at absolute path: {os.path.abspath(csv_path)}")
        logger.info(f"[DEBUG] CSV absolute path: {os.path.abspath(csv_path)}", file=sys.stderr)
        logger.info(f"[DEBUG] Exists? {os.path.exists(csv_path)}", file=sys.stderr)
        current_dir = os.getcwd()
        logger.warning(f"Current working directory: {current_dir}")
        
        if not os.path.exists(csv_path):
            logger.warning(f"CSV file not found at {csv_path}, using default symbols")
            return ['7203.T', '9432.T', '9984.T', '6758.T', '6861.T', 
                    '7974.T', '9433.T', '8306.T', '8316.T', '6501.T']
        
        df = pd.read_csv(csv_path, encoding='utf-8')
        
        prime_stocks = df[
        (df['市場・商品区分'].str.contains('プライム（内国株式）', na=False)) & (df['規模区分'] == 'TOPIX Large')
        ]
        
        selected_stocks = prime_stocks[['コード', '銘柄名']]
        
        symbols = [f"{code}.T" for code in selected_stocks['コード'].astype(str)]
        
        logger.info(f"Loaded {len(symbols)} Japanese stock symbols")
        return symbols
    except Exception as e:
        logger.error(f"Error loading Japan symbols: {e}", exc_info=True)
        return ['7203.T', '9432.T', '9984.T', '6758.T', '6861.T']

JAPAN_SYMBOLS = load_japan_symbols()

stockget_bp = Blueprint('get_stocks', __name__, url_prefix='/api')
@stockget_bp.route('/stocks', methods=['GET'])
def get_stocks():
    result = repo_service.get_stocks()
    if not result:
        return jsonify({"error": "No stocks found"}), 404
    return result

price_bp = Blueprint('price', __name__, url_prefix='/api')

@price_bp.route('/price/<symbol>', methods=['GET'])
def get_stock_price(symbol):
    result = Price.get_stock_price(symbol)
    if result is None:
        return jsonify({"error": f"Could not fetch price for symbol: {symbol}"}), 500
    return result

holdings_bp = Blueprint('holdings', __name__, url_prefix='/api')

@holdings_bp.route('/holdings', methods=['GET'])
def get_holdings():
    result = repo_service.get_holdings()
    if not result:
        return jsonify({"error": "No holdings found"}), 404
    return result

stockinsert_bp = Blueprint('insert_stocks', __name__, url_prefix='/api')

@stockinsert_bp.route('/stocks', methods=['POST'])  
def insert_stock():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON data"}), 400

    required_fields = ['symbol', 'action', 'quantity']
    if not all(field in data for field in required_fields):
        missing = [field for field in required_fields if field not in data]
        return jsonify({"error": f"Missing required fields: {missing}"}), 400

    result, status_code = repo_service.insert_stock(data)
    return jsonify(result), status_code

transaction_bp = Blueprint('transaction', __name__, url_prefix='/api')

@transaction_bp.route('/transaction', methods=['GET'])
def get_transactions():
    result = repo_service.get_transactions()
    if not result:
        return jsonify({"error": "No transactions found"}), 404
    return result

profitloss_bp = Blueprint('profit_loss', __name__, url_prefix='/api')

@profitloss_bp.route('/profit_loss', methods=['GET'])
def get_profit_loss():
    result = profit_loss.get_profit_loss()
    if not result:
        return jsonify({"error": "No profit/loss data found"}), 404
    return result

portfolio_bp = Blueprint('portfolio', __name__, url_prefix='/api')

@portfolio_bp.route('/portfolio', methods=['GET'])
def get_portfolio():
    result = portfolio.get_portfolio()
    if not result:
        return jsonify({"error": "No portfolio data found"}), 404
    return result

def update_top_stocks():
    """Update cached top stocks data"""
    global cached_top_stocks, last_update_time
    try:
        logger.info("Starting top stocks update...")
        stock_data = []
        
        for symbol in TOP_SYMBOLS:
            try:
                logger.info(f"Fetching data for {symbol}...")
                ticker = yf.Ticker(symbol)
                info = ticker.info
                hist = ticker.history(period="1d")
                
                if not hist.empty:
                    prev_close = info.get('previousClose', 0)
                    current_price = hist['Close'].iloc[-1] if 'Close' in hist else 0
                    change = current_price - prev_close
                    change_percent = (change / prev_close * 100) if prev_close > 0 else 0
                    
                    stock_data.append({
                        'symbol': symbol,
                        'name': info.get('longName', symbol),
                        'price': current_price,
                        'change': change,
                        'changePercent': change_percent,
                        'volume': hist['Volume'].iloc[-1] if 'Volume' in hist else 0
                    })
                    logger.info(f"Successfully processed {symbol}")
                else:
                    logger.warning(f"Empty history data for {symbol}")
            except Exception as symbol_error:
                logger.error(f"Error processing symbol {symbol}: {symbol_error}", exc_info=True)
        
        if stock_data: 
            cached_top_stocks = stock_data
            last_update_time = time.time()
            logger.info(f"Top stocks cache updated at {time.strftime('%H:%M:%S')} with {len(stock_data)} stocks")
        else:
            logger.warning("No stock data was collected, keeping old cache")
    except Exception as e:
        logger.error(f"Error updating top stocks cache: {e}", exc_info=True)

def update_japan_stocks():
    """日本株式のデータを更新"""
    global cached_japan_stocks, japan_last_update_time
    try:
        logger.info("Starting Japan stocks update...")
        stock_data = []
        
        for symbol in JAPAN_SYMBOLS:
            try:
                logger.info(f"Fetching data for {symbol}...")
                ticker = yf.Ticker(symbol)
                info = ticker.info
                hist = ticker.history(period="1d")
                
                if not hist.empty:
                    prev_close = info.get('previousClose', 0)
                    current_price = hist['Close'].iloc[-1] if 'Close' in hist else 0
                    change = current_price - prev_close
                    change_percent = (change / prev_close * 100) if prev_close > 0 else 0
                    
                    # 銘柄コード（.Tを除く）を取得
                    code = symbol.split('.')[0]
                    
                    stock_data.append({
                        'symbol': symbol,
                        'code': code,
                        'name': info.get('longName', symbol),
                        'price': current_price,
                        'change': change,
                        'changePercent': change_percent,
                        'volume': hist['Volume'].iloc[-1] if 'Volume' in hist else 0
                    })
                    logger.info(f"Successfully processed {symbol}")
                else:
                    logger.warning(f"Empty history data for {symbol}")
            except Exception as symbol_error:
                logger.error(f"Error processing symbol {symbol}: {symbol_error}", exc_info=True)
        
        if stock_data: 
            cached_japan_stocks = stock_data
            japan_last_update_time = time.time()
            logger.info(f"Japan stocks cache updated at {time.strftime('%H:%M:%S')} with {len(stock_data)} stocks")
        else:
            logger.warning("No Japan stock data was collected, keeping old cache")
    except Exception as e:
        logger.error(f"Error updating Japan stocks cache: {e}", exc_info=True)

def convert_numpy_types(obj):
    if isinstance(obj, dict):
        return {k: convert_numpy_types(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_numpy_types(item) for item in obj]
    elif isinstance(obj, np.integer):
        return int(obj)  # numpy.int64 -> int
    elif isinstance(obj, np.floating):
        return float(obj)  # numpy.float64 -> float
    elif isinstance(obj, np.ndarray):
        return obj.tolist()  # ndarray -> list
    else:
        return obj

top_stocks_bp = Blueprint('top_stocks', __name__, url_prefix='/api')

@top_stocks_bp.route('/top_stocks', methods=['GET'])
def get_top_stocks():
    """Get stock data for top companies from cache"""
    global cached_top_stocks
    
    try:
        if not cached_top_stocks:
            logger.info("Cache empty, updating top stocks...")
            update_top_stocks()
        
        serializable_data = convert_numpy_types(cached_top_stocks)
        return jsonify(serializable_data)
    except Exception as e:
        logger.error(f"Error in get_top_stocks: {e}", exc_info=True)
        return jsonify({"error": "Failed to get top stocks data"}), 500

# 日本株式用のエンドポイントを追加
japan_stocks_bp = Blueprint('japan_stocks', __name__, url_prefix='/api')

@japan_stocks_bp.route('/japan_stocks', methods=['GET'])
def get_japan_stocks():
    """Get stock data for Japanese companies"""
    global cached_japan_stocks
    
    try:
        if not cached_japan_stocks:
            logger.info("Japan stocks cache empty, updating...")
            update_japan_stocks()
        
        serializable_data = convert_numpy_types(cached_japan_stocks)
        return jsonify(serializable_data)
    except Exception as e:
        logger.error(f"Error in get_japan_stocks: {e}", exc_info=True)
        return jsonify({"error": "Failed to get Japan stocks data"}), 500


@price_bp.route('/long_term_price/<symbol>', methods=['GET'])
def get_long_stock_price(symbol):
    result = Price.get_long_stock_price(symbol)
    if result is None:
        return jsonify({"error": f"Could not fetch long-term price for symbol: {symbol}"}), 500
    return result


@price_bp.route('/long_term_balance/<days>', methods=['GET'])
def get_long_term_balance(days):
    num_days = int(days)
    result = Price.get_long_term_balance(num_days)
    if result is None:
        return jsonify({"error": "Could not fetch long-term balance"}), 500
    return result