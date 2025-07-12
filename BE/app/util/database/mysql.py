from app.config.config import settings 
import mysql.connector
from mysql.connector import Error as MySQLError
import logging
from app.util.database.db_impl import DBImpl, ExecuteError
from app.core.exceptions import ConnectionError as DBConnectionError, QueryExecutionError


class MySQL(DBImpl):
    def __init__(self):
        super().__init__()
    
    def __del__(self):
        pass

    def _connect(self):
        try:
            connection = mysql.connector.connect(
                host=settings.RDB_HOST,
                port=settings.RDB_PORT,
                user=settings.DB_USER,
                password=settings.DB_PASSWORD,
                database=settings.DB_NAME,
                connect_timeout=settings.CONNECTION_TIMEOUT
            )
            self.connection = connection
        except MySQLError as e:
            logging.error(f"데이터베이스 연결 실패: {e}")
            raise DBConnectionError("데이터베이스에 연결할 수 없습니다", e)

    def execute(self, query, bind_value=None):
        cnx = None
        cursor = None
        try:
            cnx = self.pool.get_connection()
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
                    "lastrowid": getattr(cursor, "lastrowid", None)
                }
            else:
                result = None

        except MySQLError as e:
            if cnx:
                try:
                    cnx.rollback()
                except:
                    pass
            logging.error(f"MySQL 쿼리 실행 오류: {e}, Query: {query[:100]}...")
            raise QueryExecutionError(f"쿼리 실행에 실패했습니다: {str(e)}", e)
        except Exception as e:
            if cnx:
                try:
                    cnx.rollback()
                except:
                    pass
            logging.error(f"예상치 못한 오류: {e}, Query: {query[:100]}...")
            raise QueryExecutionError(f"예상치 못한 오류가 발생했습니다: {str(e)}", e)

        finally:
            if cursor:
                try:
                    cursor.close()
                except Exception as e:
                    logging.warning(f"cursor.close() 실패: {e}")
            if cnx:
                try:
                    cnx.close()
                except Exception as e:
                    logging.warning(f"cnx.close() 실패: {e}")
        return result 

    def execute_many(self, query, bind_value, fields=None):
        cnx = None
        cursor = None
        try:
            cnx = self.pool.get_connection()
            cursor = cnx.cursor()
            cursor.executemany(query, bind_value)
            cnx.commit()
            result = cursor.fetchall()
            return result
        except MySQLError as e:
            if cnx:
                try:
                    cnx.rollback()
                except:
                    pass
            logging.error(f"MySQL executemany 오류: {e}, Query: {query[:100]}...")
            raise QueryExecutionError(f"배치 쿼리 실행에 실패했습니다: {str(e)}", e)
        except Exception as e:
            if cnx:
                try:
                    cnx.rollback()
                except:
                    pass
            logging.error(f"예상치 못한 오류: {e}, Query: {query[:100]}...")
            raise QueryExecutionError(f"예상치 못한 오류가 발생했습니다: {str(e)}", e)
        finally:
            if cursor:
                try:
                    cursor.close()
                except Exception as e:
                    logging.warning(f"cursor.close() 실패: {e}")
            if cnx:
                try:
                    cnx.close()
                except Exception as e:
                    logging.warning(f"cnx.close() 실패: {e}")

    def add_bind(self, key, value):
        self.bind_value[key] = value
    
    def clear_bind(self):
        self.bind_value.clear()
    
    def commit(self):
        cnx.commit()
    
    def rollback(self):
        cnx.rollback()
