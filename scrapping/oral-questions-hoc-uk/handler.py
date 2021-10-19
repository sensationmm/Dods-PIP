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
content_type = 'Oral Questions HOC (UK)'

content_template_file_path = os.path.abspath(os.curdir)+'/templates/content_template.json'
config = Config().config_read(("config.ini"))
common = Common()
def run(event, context):
    logger.debug('Starting scrapping process with BUCKET: "%s", prefix: "%s" ', BUCKET, PREFIX)
    s3 = boto3.client('s3')
    try:
        for i in range(1, 2, 1):
            date_from, date_to = common.dateRange(i)
            scraper_url = config.get('parser', 'sourceUrl', fallback=None)
            url = scraper_url.format(date_from=date_from, date_to=date_to)
            print("mainUrl::", url)

            response = requests.get(url).content
            json_content = dumps(xmltodict.parse(response))
            dict_content = loads(json_content)

            data = response.decode('utf-8', errors = 'ignore')
            data = BeautifulSoup(data, 'html5lib')
            items = data.findChild('items').find_all('item')
            Originator_list = eval(config.get('Originator', 'Originator_list'))

            for item in dict_content['result']['items']['item']:
                content = common.get_file_content(content_template_file_path)
                content['contentType'] = content_type
                content['contentSource'] = config.get('parser', 'contentSource')
                content['contentSourceURL'] = config.get('parser', 'sourceUrl')
                content['extractDate'] = datetime.now().isoformat()
                content['content'] = item
                content['metadata']['jurisdiction'] = 'UK'

                short_date = datetime.now().strftime("%Y-%m-%d")
                try:
                    Validator().content_schema_validator(content)
                except Exception as e:
                    logger.info('Content is not valid')
                    continue

                hash_code = Common.hash(
                    item['questionText'],
                    item['Location']['@href'],
                    item['tablingMemberPrinted']['item'],
                    item['AnswerDate']['#text'],
                    short_date
                )

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
                        Key=(PREFIX + '/' + short_date + '/' + hash_code)
                    )
                    logger.info('Object upload respondend with: %s', s3_response)
                    asset = DataModel()
                    asset.document_hash = hash_code
                    asset.save()
                    logger.info('Scraper %s : Completed', item['Location']['@href'])
    except Exception as e:
        logger.exception(e)
