import os
import requests
from datetime import datetime
from json import loads, dumps

import boto3
import xmltodict
from bs4 import BeautifulSoup

from lib.data_model import DataModel
from lib.logger import logger
from lib.common import Common
from lib.configs import Config
from lib.validation import Validator

BUCKET = os.environ['CONTENT_BUCKET']
PREFIX = os.environ['KEY_PREFIX']
ROOT_FOLDER = os.environ['ROOT_FOLDER']
content_type = 'Written Questions HOL (UK)'

content_template_file_path = ROOT_FOLDER + '/templates/content_template.json'
config = Config().config_read("config.ini")


# noinspection PyUnusedLocal
def run(event, context):
    logger.debug('Starting scrapping process with BUCKET: "%s", prefix: "%s" ', BUCKET, PREFIX)
    s3 = boto3.client('s3')
    try:
        response = requests.get(config.get('parser', 'sourceUrl')).content
        soup = BeautifulSoup(response, 'html5lib')
        entries = soup.find_all('entry')

        for entry in entries:
            http_url = entry.find('id').text
            qnaxml_url = http_url.replace("http://", "https://")
            res = requests.get(qnaxml_url)
            if str(res.status_code) != '200':
                continue
            response2 = res.content.decode('utf-8', errors='ignore')
            json_content = dumps(xmltodict.parse(response2))
            dict_content = loads(json_content)

            content = Common().get_file_content(content_template_file_path)
            content['contentType'] = content_type
            content['contentSource'] = config.get('parser', 'contentSource')
            content['contentSourceURL'] = qnaxml_url
            content['extractDate'] = datetime.now().isoformat()
            content['content'] = dict_content

            short_date = datetime.now().strftime("%Y-%m-%d")
            # noinspection PyBroadException
            try:
                Validator().content_schema_validator(content)
            except Exception as e:
                logger.info('Content is not valid')
                continue

            title = dict_content['Question']['Text']

            hash_code = Common.hash(title, qnaxml_url, short_date + '3')

            document = object
            try:
                document = DataModel.get(hash_code)
            except DataModel.DoesNotExist as error:
                logger.info(error.msg)

            if hasattr(document, 'document_hash'):
                continue
            else:
                s3_response = s3.put_object(
                    Body=dumps(content).encode('UTF-8'),
                    Bucket=BUCKET,
                    Key=(PREFIX + '/' + short_date + '/' + hash_code)
                )
                logger.info('Object upload responded with: %s', s3_response)
                asset = DataModel()
                asset.document_hash = hash_code
                asset.save()
                logger.info('Scraper %s : Completed', qnaxml_url)
    except Exception as e:
        logger.exception(e)


# for local debugging purposes
if __name__ == "__main__":
    run(1, 2)
