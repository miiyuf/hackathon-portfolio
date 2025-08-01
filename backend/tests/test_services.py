import pytest
from unittest.mock import patch
from main import app
from app.main.service.price import get_stock_price

def test_get_price_success():
    symbol = "AAPL"
    result = get_stock_price(symbol)
    assert isinstance(result, dict)
    assert 'symbol' in result
    assert 'price' in result




