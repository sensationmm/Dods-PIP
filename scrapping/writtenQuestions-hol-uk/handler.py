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


WRITE_QUESTIONS_HOL_FOLDER = 'written-questions-hol-uk'
BUCKET = os.environ['S3_WRITTEN_QUESTION_BUCKET']
content_type = 'Written Questions HOL (UK)'

content_template_file_path = os.path.abspath(os.curdir)+'/templates/content_template.json'
# root_dir = os.path.abspath(os.curdir)
config = Config()._config_read(("config.ini"))
# config = Config()._config_read((root_dir + "config.ini"))
def run(event, context):
    logger.debug('BUCKET: {}'.format(BUCKET))
    s3 = boto3.client('s3')
    try:
        response = requests.get(config.get('parser', 'sourceUrl')).content
        soup = BeautifulSoup(response, 'html5lib')
        entries = soup.find_all('entry')
        Insert_Rows = []

        Originator_list = eval(config.get('Originator', 'Originator_list'))
        i = 0
        for entry in entries:
            qnaxml_url = entry.find('id').text
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
            except DataModel.DoesNotExist:
                logger.info(DataModel.DoesNotExist.msg)

            if hasattr(document, 'document_hash'):
                continue
            else:
                s3_response = s3.put_object(
                    Body=dumps(content).encode('UTF-8'),
                    Bucket=BUCKET,
                    Key=(WRITE_QUESTIONS_HOL_FOLDER + '/' + short_date + '/' + hash_code)
                )
                logger.info('Object upload respondend with: %s', s3_response)
                asset = DataModel()
                asset.document_hash = hash_code
                asset.save()
                logger.info('Scraper %s : Completed', qnaxml_url)
    except Exception as e:
        logger.exception(e)
