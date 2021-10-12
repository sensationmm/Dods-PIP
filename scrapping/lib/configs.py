import configparser
import socket
import os

# Get the Current Directory
dir_path = os.path.dirname(os.path.realpath(__file__))

hostName = socket.gethostname()


class Config:
    @staticmethod
    def config_read(config_file_path):
        """Read from configuration"""
        config = configparser.ConfigParser()
        config.read(config_file_path)

        return config
