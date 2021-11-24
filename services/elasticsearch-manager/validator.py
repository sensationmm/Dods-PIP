from logger import logger

class Validator:
    @staticmethod
    def data_validator(mappings: dict, data: dict):
        if (mappings['properties'].keys() >= data.keys()):
            logger.info(f'data is: {data}')
            return True
        else:
            logger.exception('Data is not valid!')
            return False

