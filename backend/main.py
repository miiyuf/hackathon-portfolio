from flask import Flask, jsonify, request
from flask.json import JSONEncoder
from dotenv import load_dotenv
from apscheduler.schedulers.background import BackgroundScheduler
import atexit
from flask_cors import CORS
from decimal import Decimal

# Blueprint imports
from app.main.controller.routes import stockget_bp, stockinsert_bp, holdings_bp, transaction_bp, price_bp, portfolio_bp, profitloss_bp
from app.main.service.repo_service import update_current_prices

# Load .env file
load_dotenv()

# アプリケーションの作成
app = Flask(__name__)

# CORSの設定（1回だけ必要）
CORS(app, origins="http://localhost:5173")

try:
    # Flask 2.3+
    @app.json.provider_class
    class CustomJSONProvider(app.json.provider):
        def dumps(self, obj, **kwargs):
            # Decimal -> Float
            def _preprocess_decimal(o):
                if isinstance(o, Decimal):
                    return float(o)
                elif isinstance(o, dict):
                    return {k: _preprocess_decimal(v) for k, v in o.items()}
                elif isinstance(o, (list, tuple)):
                    return [_preprocess_decimal(x) for x in o]
                return o
                
            return super().dumps(_preprocess_decimal(obj), **kwargs)
except (AttributeError, TypeError):
    class DecimalJSONEncoder(JSONEncoder):
        def default(self, obj):
            if isinstance(obj, Decimal):
                return float(obj)
            return super(DecimalJSONEncoder, self).default(obj)
    
    app.json_encoder = DecimalJSONEncoder

# Register blueprints for stock and trade routes
app.register_blueprint(stockinsert_bp)
app.register_blueprint(stockget_bp)
app.register_blueprint(holdings_bp)
app.register_blueprint(transaction_bp)
app.register_blueprint(price_bp)
app.register_blueprint(portfolio_bp)
app.register_blueprint(profitloss_bp)

# background scheduler to update current prices every 5 minutes
scheduler = BackgroundScheduler()
scheduler.add_job(func=update_current_prices, trigger="interval", minutes=5)
scheduler.start()

# Ensure the scheduler shuts down when the app exits
atexit.register(lambda: scheduler.shutdown())

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
