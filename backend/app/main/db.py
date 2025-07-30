import os
import mysql.connector
from mysql.connector import Error

def get_db_connection():
    """
    Establish a connection to the MySQL database using credentials from environment variables.
    Returns:
        A MySQL connection object if successful, or None if the connection fails.
    """
    try:
        connection = mysql.connector.connect(
            host=os.getenv('DB_HOST'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            database=os.getenv('DB_NAME')
        )
        return connection
    except Error as e:
        print(f"MySQL connection error: {e}")
        return None