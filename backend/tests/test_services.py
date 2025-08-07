from unittest.mock import patch
from main import app
from app.main.service.price import get_stock_price
from app.main.service.portfolio import get_portfolio
from app.main.service.profit_loss import get_profit_loss

def test_get_price_success():
    symbol = "AAPL"
    
    with app.app_context():
        result = get_stock_price(symbol)
        result = result.get_json()
    assert isinstance(result, dict)
    assert 'symbol' in result
    assert 'price' in result


def test_get_portfolio(mocker):
    holdings = [
        {
            "symbol": "AAPL",
            "name": "Apple Inc.",
            "total_quantity": 50,
            "total_buy_value": "7000.00",
            "total_sell_value": "1000.00"
        }
    ]

    expected_detailed_holdings = {
         "total_net_investment": "6000.00",
         "holdings": [
            {
                "symbol": "AAPL",
                "name": "Apple Inc.",
                "total_quantity": 50,
                "total_buy_value": "7000.00",
                "total_sell_value": "1000.00",
                "net_investment": "6000.00",
                "current_price": "150.00",
                "market_value": "7500.00",
                "unrealized_profit_loss": "1500.00"
            }
         ]
    }

    mocker.patch('app.main.service.portfolio.fetch_holdings', return_value=holdings)
    mocker.patch('app.main.service.portfolio.get_real_price', return_value=150.00)

    with app.app_context():
        get_portfolio_response = get_portfolio()
        get_portfolio_response = get_portfolio_response.get_json()
    
    assert get_portfolio_response['total_net_investment'] == expected_detailed_holdings['total_net_investment']
    assert get_portfolio_response['holdings'][0]["symbol"] == expected_detailed_holdings['holdings'][0]['symbol']
    assert get_portfolio_response['holdings'][0]["name"] == expected_detailed_holdings['holdings'][0]['name']
    assert float(get_portfolio_response['holdings'][0]["total_quantity"]) == float(expected_detailed_holdings['holdings'][0]['total_quantity'])
    assert float(get_portfolio_response['holdings'][0]["total_buy_value"]) == float(expected_detailed_holdings['holdings'][0]['total_buy_value'])
    assert float(get_portfolio_response['holdings'][0]["total_sell_value"]) == float(expected_detailed_holdings['holdings'][0]['total_sell_value'])
    assert float(get_portfolio_response['holdings'][0]["net_investment"]) == float(expected_detailed_holdings['holdings'][0]['net_investment'])
    assert float(get_portfolio_response['holdings'][0]["current_price"]) == float(expected_detailed_holdings['holdings'][0]['current_price'])
    assert float(get_portfolio_response['holdings'][0]["market_value"]) == float(expected_detailed_holdings['holdings'][0]['market_value'])
    assert float(get_portfolio_response['holdings'][0]["unrealized_profit_loss"]) == float(expected_detailed_holdings['holdings'][0]['unrealized_profit_loss'])      



    
def test_get_stock_price(mocker):
    mocker.patch('app.main.service.price.get_real_price', return_value=150.00)
    symbol = "AAPL"

    with app.app_context():
        data = get_stock_price(symbol)
        data = data.get_json()
    assert data['symbol'] == symbol
    assert data['price'] == 150.00

def test_get_profit_loss(mocker):
    holdings = [
        {
            "symbol": "AAPL",
            "total_buy_value": "7000.00",
            "total_quantity": "50"
        }
    ]

    mocker.patch('app.main.service.profit_loss.fetch_holdings', return_value=holdings)
    mocker.patch('app.main.service.profit_loss.get_real_price', return_value=150.00)

    with app.app_context():
        data = get_profit_loss()
        data = data.get_json()
    assert data[0]['symbol'] == 'AAPL'
    assert data[0]['current_price'] == 150.00
    assert data[0]['profit_loss'] == 150 *50 - 7000


from unittest.mock import patch
from main import app
from app.main.service.price import get_stock_price
from app.main.service.portfolio import get_portfolio
from app.main.service.profit_loss import get_profit_loss

def test_get_price_success():
    symbol = "AAPL"
    
    with app.app_context():
        result = get_stock_price(symbol)
        result = result.get_json()
    assert isinstance(result, dict)
    assert 'symbol' in result
    assert 'price' in result


def test_get_portfolio(mocker):
    holdings = [
        {
            "symbol": "AAPL",
            "name": "Apple Inc.",
            "total_quantity": 50,
            "total_buy_value": "7000.00",
            "total_sell_value": "1000.00"
        }
    ]

    expected_detailed_holdings = {
         "total_net_investment": "6000.00",
         "holdings": [
            {
                "symbol": "AAPL",
                "name": "Apple Inc.",
                "total_quantity": 50,
                "total_buy_value": "7000.00",
                "total_sell_value": "1000.00",
                "net_investment": "6000.00",
                "current_price": "150.00",
                "market_value": "7500.00",
                "unrealized_profit_loss": "1500.00"
            }
         ]
    }

    mocker.patch('app.main.service.portfolio.fetch_holdings', return_value=holdings)
    mocker.patch('app.main.service.portfolio.get_real_price', return_value=150.00)

    with app.app_context():
        get_portfolio_response = get_portfolio()
        get_portfolio_response = get_portfolio_response
    
    assert get_portfolio_response['total_net_investment'] == expected_detailed_holdings['total_net_investment']
    assert get_portfolio_response['holdings'][0]["symbol"] == expected_detailed_holdings['holdings'][0]['symbol']
    assert get_portfolio_response['holdings'][0]["name"] == expected_detailed_holdings['holdings'][0]['name']
    assert float(get_portfolio_response['holdings'][0]["total_quantity"]) == float(expected_detailed_holdings['holdings'][0]['total_quantity'])
    assert float(get_portfolio_response['holdings'][0]["total_buy_value"]) == float(expected_detailed_holdings['holdings'][0]['total_buy_value'])
    assert float(get_portfolio_response['holdings'][0]["total_sell_value"]) == float(expected_detailed_holdings['holdings'][0]['total_sell_value'])
    assert float(get_portfolio_response['holdings'][0]["net_investment"]) == float(expected_detailed_holdings['holdings'][0]['net_investment'])
    assert float(get_portfolio_response['holdings'][0]["current_price"]) == float(expected_detailed_holdings['holdings'][0]['current_price'])
    assert float(get_portfolio_response['holdings'][0]["market_value"]) == float(expected_detailed_holdings['holdings'][0]['market_value'])
    assert float(get_portfolio_response['holdings'][0]["unrealized_profit_loss"]) == float(expected_detailed_holdings['holdings'][0]['unrealized_profit_loss'])      



    
def test_get_stock_price(mocker):
    mocker.patch('app.main.service.price.get_real_price', return_value=150.00)
    symbol = "AAPL"

    with app.app_context():
        data = get_stock_price(symbol)
        data = data.get_json()
    assert data['symbol'] == symbol
    assert data['price'] == 150.00

def test_get_profit_loss(mocker):
    holdings = [
        {
            "symbol": "AAPL",
            "total_buy_value": "7000.00",
            "total_quantity": "50"
        }
    ]

    mocker.patch('app.main.service.profit_loss.fetch_holdings', return_value=holdings)
    mocker.patch('app.main.service.profit_loss.get_real_price', return_value=150.00)

    with app.app_context():
        data = get_profit_loss()
        data = data.get_json()
    assert data[0]['symbol'] == 'AAPL'
    assert data[0]['current_price'] == 150.00
    assert data[0]['profit_loss'] == 150 *50 - 7000


from app.main.service.price import get_long_term_balance

import pytest
from app.main.service.price import get_long_term_balance

def test_get_long_term_balance(mocker):
    mock_holdings_0day = [
        {'symbol': 'AAPL', 'cost_price': 100.0, 'total_quantity': 10},
        {'symbol': 'GOOG', 'cost_price': 110.0, 'total_quantity': 5}
    ]

    mock_holdings_1day = [
        {'symbol': 'AAPL', 'cost_price': 100.0, 'total_quantity': 10},
        {'symbol': 'GOOG', 'cost_price': 110.0, 'total_quantity': 5}
    ]

    mock_holdings_2day = [
        {'symbol': 'AAPL', 'cost_price': 100.0, 'total_quantity': 10},
    ]

    mock_prices = {
        'AAPL': [140.0, 150.0, 160.0], 
        'GOOG': [270.0, 280.0, 290.0]
    }

    expected = [
        ((140- 100) * 10)/(100* 10) * 100, 
        ((150- 100) * 10 + (280-110) * 5) / (100 * 10 + 110 * 5) * 100, 
        ((160-100) * 10 + (290-110) * 5) / (100 * 10 + 110 * 5) * 100]

    # get_holdings の side_effect: 各日付での holdings を返す
    mocker.patch('app.main.service.price.get_holdings', side_effect=[
        mock_holdings_2day,   # day=2
        mock_holdings_1day,  # day=1
        mock_holdings_0day,  # day=0
        ])


    mocker.patch('app.main.service.price.get_long_term_price', side_effect=lambda symbol, days: mock_prices[symbol])

    with app.app_context():

        result,status = get_long_term_balance(days=3)
        result = result.get_json().get('long_term_balance')

    assert isinstance(result, list)
    assert len(result) == 3
    assert float(result[0]) == float(expected[0])
    assert float(result[1]) == float(expected[1])
    assert float(result[2]) == float(expected[2])



