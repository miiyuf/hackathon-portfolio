from app.main.db import get_db_connection
from flask import Blueprint, request, jsonify
from mysql.connector import Error

def get_stocks():
    """
    Retrieve all stock records from the 'stocks' table.
    Returns:
        JSON response with the list of stocks or an error message if the DB connection fails.
    """
    conn = get_db_connection()
    if conn is None:
        # return jsonify({"error": "DB connection failed"}), 500
        return []


    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM stocks;")
    results = cursor.fetchall()
    cursor.close()
    conn.close()

    return results



def insert_stock(data):
    """
    Insert a new stock record into the 'stocks' table.
    Expects a JSON payload with the following fields:
        - symbol: Stock symbol (string)
        - name: Stock name (string)
        - purchase_price: purchase price of the stock (float)
        - action: Action type (e.g., 'buy' or 'sell') (string)
        - quantity: Quantity of the stock (integer)
    Returns:
        JSON response with a success message or an error message if the insertion fails.
    """
    # data = request.get_json()

    # required_fields = ['symbol', 'name', 'purchase_price', 'action', 'quantity']
    # if not all(field in data for field in required_fields):
    #     # return jsonify({"error": "Missing required fields"}), 400
    #     return []

    required_fields = ['symbol', 'purchase_price', 'action', 'quantity']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    if len(data['symbol']) > 10:
        return jsonify({"error": "Symbol must be 10 characters or less"}), 400
    
    if data['action'] not in ['buy', 'sell']:
        return jsonify({"error": "Action must be either 'buy' or 'sell'"}), 400

    conn = get_db_connection()
    if isinstance(conn, tuple):
        return conn
    
    try:
        cursor = conn.cursor()
        query = """
            INSERT INTO stocks (symbol, purchase_price, action, quantity)
            VALUES (%s, %s, %s, %s)
        """
        values = (
            data['symbol'],
            data['purchase_price'],
            data['action'],
            data['quantity']
        )
        cursor.execute(query, values)
        conn.commit()
        return jsonify({"message": "Stock inserted successfully"}), 201
    except Error as e:
        logger.error(f"Error inserting stock: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        conn.close()
    

