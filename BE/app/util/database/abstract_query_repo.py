from abc import ABCMeta, abstractmethod
import mysql.connector
import os
from contextlib import contextmanager


class AbstractQueryRepo(metaclass=ABCMeta):
    def __init__(self):
        self.queries = {}
    
    def get_sql(self, sql_name):
        return self.queries[sql_name]
    
@contextmanager
def get_connection():
    conn = mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", "1234"),
        database=os.getenv("DB_NAME", "jungle_slam"),
        port=int(os.getenv("DB_PORT", 3306)),
    )
    try:
        yield conn
    finally:
        conn.close()
        

