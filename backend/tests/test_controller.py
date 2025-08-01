import pytest
from unittest.mock import patch
from main import app

@patch("app.main.bussinesslogic.calc_portfolio.get_real_price")
def test_get_price_success(mock_get_real_price):
    mock_get_real_price.return_value = 123.45

    with app.test_client() as client:
        response = client.get("/api/price/AAPL")
        assert response.status_code == 200

def test_get_price_failure():
    with app.test_client() as client:
        response = client.get("/api/price/INVALID")
        assert response.status_code == 500



