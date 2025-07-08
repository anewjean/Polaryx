from mysql.connector import pooling
from app.config.config import settings 
import mysql.connector
from app.util.database.db_impl import DBImpl, ExecuteError


class MySQL(DBImpl):
    def __init__(self):
        super().__init__()
    
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
        cnx = self.pool.get_connection()
        cursor = cnx.cursor()
        try:
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

        except Exception as e:
            raise ExecuteError(f"쿼리 실행에 실패했습니다 :: {e}")

        finally:
            try:
                print("******** cursor.close() 실행 ********")
                cursor.close()
            except Exception:
                print("cursor.close() 실패.")
                pass
            try:
                print("******** cnx.close() 실행 ********")
                cnx.close()
            except:
                print("cnx.close() 실패.")
                pass
        return result 

    def execute_many(self, query, bind_value, fields=None):
        try:
            cnx = self.pool.get_connection()
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
