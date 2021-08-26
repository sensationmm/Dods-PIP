import configparser
import socket
import os

### Get the Current Directory ### 
dir_path = os.path.dirname(os.path.realpath(__file__))

hostName = socket.gethostname()


class Config:
    def _config_read(self, config_file_path):
        ### Read from configuration ###
        config = configparser.ConfigParser()
        # config.read(dir_path+"/configurations/scraper.ini")
        config.read(config_file_path)

        return config
