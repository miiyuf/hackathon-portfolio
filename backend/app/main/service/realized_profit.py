from flask import jsonify
from app.main.database.db import get_db_connection
import logging
from decimal import Decimal
import sys
import os

# Setup logging
logger = logging.getLogger(__name__)
log_level = os.environ.get("LOG_LEVEL", "INFO").upper()
logger.setLevel(getattr(logging, log_level, logging.INFO))

if not logger.handlers:
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
    logger.addHandler(handler)

def get_realized_profit():
    """
    Calculate realized profit/loss from completed sell transactions.
    
    Returns a list of sell transactions with their realized profit/loss.
    """
    logger.info("=== Starting realized_profit calculation ===")
    
    conn = get_db_connection()
    if conn is None:
        logger.error("Database connection failed")
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cursor = conn.cursor(dictionary=True)
        
        # The query compares the average purchase price of buy transactions with sell transactions to calculate realized profit/loss
        # Note: This example uses average cost method instead of FIFO
        query = """
        WITH buy_avg AS (
            SELECT 
                symbol,
                SUM(purchase_price * quantity) / SUM(quantity) AS avg_buy_price,
                SUM(quantity) AS total_bought
            FROM transactions
            WHERE action = 'buy'
            GROUP BY symbol
        )
        SELECT 
            t.id,
            t.symbol,
            sm.name,
            t.quantity,
            t.purchase_price AS sell_price,
            b.avg_buy_price AS buy_price,
            (t.purchase_price - b.avg_buy_price) * t.quantity AS realized_profit,
            (t.purchase_price - b.avg_buy_price) / b.avg_buy_price * 100 AS percent_return,
            t.created_at AS sell_date
        FROM transactions t
        JOIN buy_avg b ON t.symbol = b.symbol
        LEFT JOIN stock_master sm ON t.symbol = sm.symbol
        WHERE t.action = 'sell'
        ORDER BY t.created_at DESC;
        """
        
        cursor.execute(query)
        results = cursor.fetchall()
        
        # Calculate aggregate values
        total_realized_profit = Decimal('0')
        transactions_processed = 0
        
        processed_results = []
        for row in results:
            transactions_processed += 1
            # None値をチェック
            if row['realized_profit'] is not None:
                total_realized_profit += Decimal(str(row['realized_profit']))
            
            # 数値型をフロートに変換（JSONシリアライズのため）
            processed_row = {}
            for key, value in row.items():
                if isinstance(value, Decimal):
                    processed_row[key] = float(value)
                else:
                    processed_row[key] = value
            
            processed_results.append(processed_row)
        
        response_data = {
            'transactions': processed_results,
            'summary': {
                'total_realized_profit': float(total_realized_profit),
                'transactions_count': transactions_processed
            }
        }
        
        logger.info(f"Processed {transactions_processed} sell transactions")
        logger.info(f"Total realized profit/loss: {total_realized_profit}")
        logger.info("=== Finished realized_profit calculation ===")
        
        return jsonify(response_data)
        
    except Exception as e:
        logger.error(f"Error calculating realized profit: {e}", exc_info=True)
        return jsonify({"error": f"Error calculating realized profit: {str(e)}"}), 500
    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()
        conn.close()
        logger.info("Database connection closed")