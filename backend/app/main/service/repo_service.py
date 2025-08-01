from app.main.repository import holding, stock, transaction

def get_stocks():
    return stock.get_stocks()

def get_holdings():
    return holding.get_holdings()

def insert_stock(data):
    return stock.insert_stock(data)
def get_transactions():
    return transaction.get_transactions()