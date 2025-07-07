from abc import ABCMeta, abstractmethod

class ConnectionError(Exception):
    pass


class ExecuteError(Exception):
    pass


class DBImpl(metaclass = ABCMeta):
    def __init__(self):
        self.connection = None
        self.conn_args = {}