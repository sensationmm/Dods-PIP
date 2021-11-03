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

    @staticmethod
    def migration_content_file_paths_validator(body: dict):
        required_paths = {
            'file_path_content': '',
            'file_path_metadata': '',
            'file_path_html': ''
        }
        if (required_paths.keys() <= body.keys()):
            logger.info(f'Message body: {body}')
            return True
        else:
            logger.exception('File paths are not valid!')
            return False

    @staticmethod
    def migration_content_root_paths_validator(body: dict):
        required_paths = {
            'root_path': ''
        }
        if required_paths.keys() <= body.keys():
            logger.info(f'Root path: {body["root_path"]}')
            return True
        else:
            logger.exception('root paths is not valid!')
            return False

    @staticmethod
    def prepare_migration_content_message(message: dict, filename: str):
        if '.ml' in filename:
            message['file_path_metadata'] = filename
        elif '.html' in filename:
            message['file_path_html'] = filename
        elif '.dodsil' in filename:
            message['file_path_content'] = filename
        return message
