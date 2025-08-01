from flask import Flask, jsonify, request
from dotenv import load_dotenv
from apscheduler.schedulers.background import BackgroundScheduler
import atexit
from flask_cors import CORS

# Blueprint imports
from app.main.controller.routes import stockget_bp, stockinsert_bp, holdings_bp, transaction_bp, price_bp, portfolio_bp, profitloss_bp
# from app.main.services.price import price_bp
# from app.main.services.holding import holdings_bp
# from app.main.services.transaction import transaction_bp
# from app.main.services.insert_stocks import stockinsert_bp
# from app.main.services.get_stock import stockget_bp
# from app.main.services.portfolio import portfolio_bp
# from app.main.services.profit_loss import profitloss_bp

# 
from app.main.bussinesslogic.calc_portfolio import update_current_prices

# Load .env file
load_dotenv()

app = Flask(__name__)
CORS(app, origins="http://localhost:5173")


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
