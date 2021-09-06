from jsonschema import validate, Draft4Validator, SchemaError
from json import loads
import os
from logger import logger


class Validator:
    @staticmethod
    def content_schema_validator(content: dict):
        root_dir = os.path.abspath(os.curdir)
        schema_path = root_dir + '/templates/content_json_schema.json'

        with open(schema_path, 'r') as schema_file:
            schema = loads(schema_file.read())
        try:
            Draft4Validator.check_schema(schema)
        except SchemaError as schemaError:
            logger.exception(schemaError)
            raise Exception('Content is not valid!')

        try:
            validate(instance=content, schema=schema)
        except SchemaError as schemaError:
            logger.exception(schemaError)
            raise Exception('Content is not valid!')
