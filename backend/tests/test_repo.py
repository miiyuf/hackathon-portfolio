from backend.app.main.repository.stock import get_stocks
from app.main.repository.holding import get_holdings

def test_get_stocks_success():
    results = get_stocks()
    assert isinstance(results, list)
    assert len(results) > 0
    assert 'symbol' in results[0]
    assert 'price' in results[0]

def test_get_holdings_success():
    results = get_holdings()
    assert isinstance(results, list)
    assert len(results) > 0
    assert 'symbol' in results[0]
    assert 'quantity' in results[0]
    assert 'price' in results[0]