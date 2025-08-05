from app.main.db import get_db_connection
from flask import Blueprint, request, jsonify

# stockget_bp = Blueprint('get_stocks', __name__, url_prefix='/api')

# @stockget_bp.route('/stocks', methods=['GET'])
def get_stocks():
    """
    Retrieve all stock records from the 'stocks' table.
    Returns:
        JSON response with the list of stocks or an error message if the DB connection fails.
    """
    conn = get_db_connection()
    if isinstance(conn, tuple):
        return conn

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM stocks;")
    results = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(results)