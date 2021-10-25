import requests
import xmltodict
from lxml import etree

from lib.data_model import DataModel
from lib.logger import logger
import boto3
import os
from datetime import datetime
from json import dumps, loads
from lib.common import Common
from lib.configs import Config
from lib.validation import Validator


BUCKET = os.environ['CONTENT_BUCKET']
PREFIX = os.environ['KEY_PREFIX']
content_type = 'Debates (Northern Ireland)'

content_template_file_path = os.path.abspath(os.curdir)+'/templates/content_template.json'
config = Config().config_read("config.ini")


# noinspection PyUnusedLocal,HttpUrlsUsage,DuplicatedCode
def run(event, context):
    logger.debug('Starting scrapping process with BUCKET: "%s", prefix: "%s" ', BUCKET, PREFIX)
    s3 = boto3.client('s3')
    try:
        main_url = config.get('parser', 'sourceUrl', fallback=None)

        # legacy code
        response1 = requests.get(main_url).content
        tree = etree.fromstring(response1)

        for plenary in tree.findall('Plenary'):
            print("###########################################################")
            motion = etree.Element("Motion")
            document_id = plenary.find('DocumentID').text
            etree.SubElement(motion, 'DocumentID').text = document_id
            etree.SubElement(motion, 'MotionCategory').text = plenary.find('MotionCategory').text
            title = plenary.find('Title').text
            etree.SubElement(motion, 'Title').text = title
            etree.SubElement(motion, 'TabledDate').text = plenary.find('TabledDate').text

            text_url = "http://data.niassembly.gov.uk/plenary.asmx/GetPlenaryDetails?DocumentId={}".format(document_id)
            print("text_url::", text_url)

            # ttree = ''
            try:
                response2 = requests.get(text_url).content
                ttree = etree.fromstring(response2)
            except Exception as e:
                print(e)
                continue

            etree.SubElement(motion, 'Session').text = ttree.find('Plenary/Session').text
            etree.SubElement(motion, 'Text').text = ttree.find('Plenary/Text').text

            tablers_url = "http://data.niassembly.gov.uk/plenary.asmx/GetPlenaryTablers?documentId={}".format(
                document_id
            )
            print("tablers_url::", tablers_url)

            response3 = requests.get(tablers_url).content
            mtree = etree.fromstring(response3)
            secondary_tabler = etree.Element("SecondaryTabler")
            for tablerDetails in mtree.findall('Tabler'):
                tabler = etree.Element("Tabler")
                etree.SubElement(tabler, 'TablerName').text = tablerDetails.find('TablerName').text
                etree.SubElement(tabler, 'TablerTitle').text = tablerDetails.find('TablerTitle').text
                secondary_tabler.append(tabler)
            motion.append(secondary_tabler)

            data = etree.tostring(motion, pretty_print=True, encoding='UTF-8', xml_declaration=True)

            content = {
                'data': loads(dumps(xmltodict.parse(data))),
                'Scraped_PlenaryDetails': loads(dumps(xmltodict.parse(response2))),
                'Scraped_PlenaryTablers': loads(dumps(xmltodict.parse(response3)))
            }

            # SOMO process - store data
            final_content = Common().get_file_content(content_template_file_path)
            final_content['contentType'] = content_type
            final_content['contentSource'] = config.get('parser', 'contentSource')
            final_content['contentSourceURL'] = main_url
            final_content['extractDate'] = datetime.now().isoformat()
            final_content['content'] = content
            content['metadata']['jurisdiction'] = 'UK'

            short_date = datetime.now().strftime("%Y-%m-%d")

            try:
                Validator().content_schema_validator(final_content)
            except Exception as e:
                print(e)
                logger.info('Content is not valid')
                continue

            hash_code = Common.hash(content['title'], main_url, short_date)

            document = object
            try:
                document = DataModel.get(hash_code)
            except DataModel.DoesNotExist:
                logger.info(DataModel.DoesNotExist.msg)

            if hasattr(document, 'document_hash'):
                continue
            else:
                s3_response = s3.put_object(
                    Body=dumps(final_content).encode('UTF-8'),
                    Bucket=BUCKET,
                    Key=(PREFIX + '/' + short_date + '/' + hash_code)
                )
                logger.info('Object upload responded with: %s', s3_response)
                asset = DataModel()
                asset.document_hash = hash_code
                asset.save()
                logger.info('Scraper %s : Completed', main_url)
    except Exception as e:
        logger.exception(e)


if __name__ == '__main__':
    run('test', 'test')
