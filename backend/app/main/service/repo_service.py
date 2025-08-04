from app.main.repository import holding, stock, transaction, update

def get_stocks():
    return stock.get_stocks()

def get_holdings():
    return holding.get_holdings()

def insert_stock(data):
    return stock.insert_stock(data)

def get_transactions():
    return transaction.get_transactions()

def update_current_prices():
    return update.update_current_prices()