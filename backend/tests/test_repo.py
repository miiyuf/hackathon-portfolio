from app.main.repository.stock import get_stocks
from app.main.repository.stock import insert_stock
from app.main.repository.holding import get_holdings
from app.main.repository.transaction import get_transactions
from app.main.repository.update import update_current_prices
from app.main.repository.fetchholding import fetch_holdings
from main import app
import json



def test_get_stocks_success(mocker):

    expected_stocks = [
        {'symbol': 'AAPL', 'action': 'buy', 'purchase_price': 150.0, 'quantity': 10, 'id': 1}
    ]

    mock_cursor = mocker.Mock()
    mock_conn = mocker.Mock()
    mock_conn.cursor.return_value = mock_cursor
    mock_cursor.fetchall.return_value = expected_stocks

    mocker.patch('app.main.repository.stock.get_db_connection', return_value=mock_conn)

    result = get_stocks()
    mock_cursor.execute.assert_called()
    mock_cursor.close.assert_called()
    mock_conn.close.assert_called()

    assert result == expected_stocks



def test_insert_stock_success(mocker):
    mock_cursor = mocker.Mock()
    mock_conn = mocker.Mock()

    mock_conn.cursor.return_value = mock_cursor
    mocker.patch('app.main.repository.stock.get_db_connection', side_effect=[mock_conn])

    mocker.patch('app.main.repository.stock.repo_service.get_stock_name_from_ticker', return_value="Apple Inc.")
    mocker.patch('app.main.repository.stock.insert_stock_symbol_pair_if_not_exists', return_value=None)

    stock_data = {
        'symbol': 'AAPL',
        'action': 'buy',
        'purchase_price': 100.0,
        'quantity': 10
    }

    with app.app_context():
        response,state = insert_stock(stock_data)
        response = response.get_json()

    mock_cursor.execute.assert_called()
    mock_cursor.close.assert_called()
    mock_conn.commit.assert_called()
    mock_conn.close.assert_called()

    assert response == {"message": "Stock inserted successfully"}


def test_get_holdings_success(mocker):
    mock_cursor = mocker.Mock()
    mock_conn = mocker.Mock()
    mock_conn.cursor.return_value = mock_cursor
    mock_cursor.fetchall.return_value = [
        {'symbol': 'AAPL', 'name': 'Apple Inc.', 'total_quantity': 10, 'cost_price': 150.0}
    ]

    mocker.patch('app.main.repository.holding.get_db_connection', return_value=mock_conn)

    with app.app_context():
        result = get_holdings()
        result = result.get_json()

    mock_cursor.execute.assert_called()
    mock_cursor.close.assert_called()
    mock_conn.close.assert_called()

    assert result == [{'symbol': 'AAPL', 'name': 'Apple Inc.', 'total_quantity': 10, 'cost_price': 150.0}]


def test_get_transactions_success(mocker):
    expected_transactions = [
        {'id': 1, 'symbol': 'AAPL', 'action': 'buy', 'purchase_price': 150.0, 'quantity': 10}
    ]

    mock_cursor = mocker.Mock()
    mock_conn = mocker.Mock()
    mock_conn.cursor.return_value = mock_cursor
    mock_cursor.fetchall.return_value = expected_transactions

    mocker.patch('app.main.repository.transaction.get_db_connection', return_value=mock_conn)

    with app.app_context():
        result = get_transactions()
        result = result.get_json()
    
    mock_cursor.execute.assert_called()
    mock_cursor.close.assert_called()
    mock_conn.close.assert_called()

    assert result == expected_transactions

def test_update_current_prices_success(mocker):
    mock_cursor = mocker.Mock()
    mock_conn = mocker.Mock()

    mock_conn.cursor.return_value = mock_cursor
    mock_cursor.fetchall.return_value = [{'symbol': 'AAPL'}, {'symbol': 'GOOGL'}]
    mock_cursor.execute.return_value = None

    mocker.patch('app.main.repository.update.get_real_price', return_value=100.0)
    mocker.patch('app.main.repository.update.get_db_connection', return_value=mock_conn)

    update_current_prices()

    mock_cursor.execute.assert_called()
    mock_cursor.close.assert_called()
    mock_conn.commit.assert_called()
    mock_conn.close.assert_called()

def test_fetchholdings_success(mocker):
    expected_holdings = [
        {
            "symbol": "AAPL",
            "name": "Apple Inc.",
            "total_quantity": 50,
            "purchase_price": 140.00
        }
    ]

    mock_cursor = mocker.Mock()
    mock_conn = mocker.Mock()
    mock_conn.cursor.return_value = mock_cursor
    mock_cursor.fetchall.return_value = expected_holdings

    mocker.patch('app.main.repository.fetchholding.get_db_connection', return_value=mock_conn)

    fetch_holdings(include_purchase_price=True)
    mock_cursor.execute.assert_called()
    mock_cursor.fetchall.assert_called()
    mock_cursor.close.assert_called()
    mock_conn.close.assert_called()

    assert expected_holdings == mock_cursor.fetchall.return_value

