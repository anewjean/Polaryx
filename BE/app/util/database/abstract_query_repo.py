from abc import ABCMeta, abstractmethod
from BE.app.util.database.db_impl import DBImpl

class AbstractQueryRepo(metaclass=ABCMeta):
    def __init__(self, db: DBImpl):
        self.queries = {}
        self.db = db
    
    def get_sql(self, sql_name):
        return self.queries[sql_name]

    @abstractmethod
    def save(self, domain_object):
        pass
