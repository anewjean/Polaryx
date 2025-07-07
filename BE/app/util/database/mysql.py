# app/util/database/mysql.py

from mysql.connector import pooling
from app.config.config import settings 
import mysql.connector
from app.util.database.db_impl import DBImpl, ExecuteError

pool = pooling.MySQLConnectionPool(
    pool_name           = "mypool",
    pool_size           = 10,
    host                = settings.RDB_HOST,
    port                = int(settings.RDB_PORT),
    user                = settings.DB_USER,
    password            = settings.DB_PASSWORD,
    database            = settings.DB_NAME,
    connection_timeout  = int(settings.CONNECTION_TIMEOUT),
    autocommit          = True
)

class MySQLDatabase:
    def execute(self, query, params):
        cnx = pool.get_connection()
        try:
            cursor = cnx.cursor()
            cursor.execute(query, params)
            return cursor.fetchall()
        finally:
            cursor.close()
            cnx.close()

# #####################################################################
# import mysql.connector
# from app.util.database.db_impl import DBImpl, ExecuteError
# from app.config.config import settings 

class MySQL(DBImpl):
    def __init__(self):
        super().__init__()
        self.cursor = None
        self.bind_value = {}
    
    def __del__(self):
        pass

    def _connect(self):
        connection = mysql.connector.connect(
            host=settings.RDB_HOST,
            port=settings.RDB_PORT,
            user=settings.DB_USER,
            password=settings.DB_PASSWORD,
            database=settings.DB_NAME,
            connect_timeout=settings.CONNECTION_TIMEOUT
        )
        self.connection = connection

    def execute(self, query, bind_value=None):
        try:
            cnx = pool.get_connection()
            cursor = cnx.cursor()

            if bind_value is None:
                cursor.execute(query)
            else:
                cursor.execute(query, bind_value)
            
            query_type = query.strip().split()[0].lower()
            if query_type == "select":
                result = cursor.fetchall()
            
            elif query_type in ("insert", "update", "delete"):
                cnx.commit()

                result = {
                    "rowcount": cursor.rowcount,
                    "lastrowid": getattr(cursor, "lastrowid", None)  # insert일 경우
                }

            cursor.close()
            cnx.close()
            return result 
        except Exception as e:
            raise ExecuteError(f"쿼리 실행에 실패했습니다 :: {e}")

    def execute_many(self, query, bind_value, fields=None):
        try:
            cnx = pool.get_connection()
            cursor = cnx.cursor()
            cursor.executemany(query, bind_value)
            cnx.commit()
            result = cursor.fetchall()
            cursor.close()
            cnx.close()
        except Exception as e:
            raise ExecuteError(f"쿼리 실행에 실패했습니다 :: {e}")

    def add_bind(self, key, value):
        self.bind_value[key] = value
    
    def clear_bind(self):
        self.bind_value.clear()
    
    def commit(self):
        cnx.commit()
    
    def rollback(self):
        cnx.rollback()
