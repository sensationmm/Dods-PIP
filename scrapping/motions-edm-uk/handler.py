import requests
from lib.data_model import DataModel
from lib.logger import logger
import boto3
import os
from datetime import datetime
from bs4 import BeautifulSoup
from json import loads, dumps
import xmltodict
from lib.common import Common
from lib.configs import Config
from lib.validation import Validator


BUCKET = os.environ['CONTENT_BUCKET']
PREFIX = os.environ['KEY_PREFIX']
content_type = 'Early Day Motions (UK)'

content_template_file_path = os.path.abspath(os.curdir)+'/templates/content_template.json'
config = Config().config_read(("config.ini"))
def run(event, context):
    logger.debug('Starting scrapping process with BUCKET: "%s", prefix: "%s" ', BUCKET, PREFIX)
    s3 = boto3.client('s3')
    try:
        #
        # Insert scraper specific code here
        #
        response = requests.get(config.get('parser', 'sourceUrl')).content
        soup = BeautifulSoup(response, 'html5lib')
        logger.info('Scraper %s : Completed', PREFIX)
        # Document processing loop

            # document = object
            # try:
            #     document = DataModel.get(hash_code)
            # except DataModel.DoesNotExist:
            #     logger.info(DataModel.DoesNotExist.msg)

            # if hasattr(document, 'document_hash'):
            #     continue
            # else:
            #     s3_response = s3.put_object(
            #         Body=dumps(content).encode('UTF-8'),
            #         Bucket=BUCKET,
            #         Key=(PREFIX + '/' + short_date + '/' + hash_code)
            #     )
            #     logger.info('Object upload respondend with: %s', s3_response)
            #     logger.info('Scraper %s : Completed', PREFIX)
    except Exception as e:
        logger.exception(e)
