from app.main.repository import holding, stock, transaction

@staticmethod
def get_stocks():
    return stock.get_stocks()

@staticmethod
def get_holdings():
    return holding.get_holdings()

@staticmethod
def insert_stock(data):
    return stock.insert_stock(data)

@staticmethod
def get_transactions():
    return transaction.get_transactions()