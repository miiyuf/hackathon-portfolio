import os
import logging
import mysql.connector
from mysql.connector import Error

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_db_connection():
    """
    Establish a connection to the MySQL database using credentials from environment variables.
    Returns:
        A MySQL connection object if successful, or None if the connection fails.
    """
    db_host = os.getenv('DB_HOST')
    db_user = os.getenv('DB_USER')
    db_password = os.getenv('DB_PASSWORD')
    db_name = os.getenv('DB_NAME')

    if not all([db_host, db_user, db_password, db_name]):
        logger.error("Missing required environment variables for database connection")
        return None

    logger.info(f"Connecting to DB with host={db_host}, user={db_user}, db={db_name}")
    
    try:
        connection = mysql.connector.connect(
            host=db_host,
            user=db_user,
            password=db_password,
            database=db_name
        )
        
        if connection.is_connected():
            logger.info("MySQL connection established successfully")
            return connection
        else:
            logger.error("MySQL connection failed without exception")
            return None
    except Error as e:
        logger.error(f"MySQL connection error: {e}")
        return None