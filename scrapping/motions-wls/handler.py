import urllib
from datetime import datetime

import requests

from lib.data_model import DataModel
from lib.logger import logger
import boto3
import os

from lxml import etree, html
from bs4 import BeautifulSoup
import dateparser

from json import loads, dumps
import xmltodict
from lib.common import Common
from lib.configs import Config
from lib.validation import Validator

BUCKET = os.environ['CONTENT_BUCKET']
PREFIX = os.environ['KEY_PREFIX']
content_type = 'Motions (Wales)'

ROOT_FOLDER = os.environ['ROOT_FOLDER']
content_template_file_path = ROOT_FOLDER + '/templates/content_template.json'
config = Config().config_read("config.ini")


# noinspection PyUnusedLocal
def run(event, context):
    # logger.debug('Starting scrapping process with BUCKET: "%s", prefix: "%s" ', BUCKET, PREFIX)
    s3 = boto3.client('s3')
    try:
        scraper_url = config.get('parser', 'sourceUrl')
        response_1 = requests.get(config.get('parser', 'sourceUrl')).content.decode('utf-8', errors='ignore')
        soup = BeautifulSoup(response_1, 'html5lib')

        for url in soup.select('.motion a'):
            url = urllib.parse.urljoin(scraper_url, url['href'])
            response_2 = requests.get(url).content.decode('utf-8', errors='ignore')
            soup = BeautifulSoup(response_2, "html5lib")

            for motion in soup.select('.motion'):
                motion_xml = etree.Element("Motion")

                title = motion.select_one('.title').get_text().strip()

                tabled_date = Common.regex('Tabled\s*on\s*:?\s*(\d+\/\d+\/\d+)', str(motion))
                tabled_date = str(
                    dateparser.parse(tabled_date, settings={'DATE_ORDER': 'DMY'})) if tabled_date else None

                etree.SubElement(motion_xml, 'TabledDate').text = tabled_date

                docID = title.split(" - ")[0]
                etree.SubElement(motion_xml, 'DocumentID').text = docID

                member_name = motion.select_one('.memberBar .name').get_text().strip()
                etree.SubElement(motion_xml, 'PrimaryTabler').text = member_name

                member_area = motion.select_one('.memberBar .area').get_text().strip()
                etree.SubElement(motion_xml, 'PrimaryTablerArea').text = member_area

                secondary_tabler = etree.Element("SecondaryTabler")

                for supporter in motion.select('.supporterDetails'):
                    tabler = etree.Element("Tabler")
                    supporter_name = supporter.select_one('.name').get_text().strip()

                    etree.SubElement(tabler, 'TablerName').text = supporter_name

                    constituency = supporter.select_one('.constituency').get_text().strip()

                    # original code assigns 'supporter_name' also for TablerArea and does not use 'constituency' value
                    etree.SubElement(tabler, 'TablerArea').text = constituency

                    secondary_tabler.append(tabler)

                motion_xml.append(secondary_tabler)

                text = etree.Element("Text")
                for element in html.fromstring(str(motion))[1:]:
                    if element.tag == 'p':
                        text.append(element)
                    else:
                        break
                motion_xml.append(text)

                xml_str = etree.tostring(motion_xml, pretty_print=True, encoding='UTF-8', xml_declaration=True)
                json_content = dumps(xmltodict.parse(xml_str))
                dict_content = loads(json_content)

                content = Common().get_file_content(content_template_file_path)
                content['contentType'] = content_type
                content['contentSource'] = config.get('parser', 'contentSource')
                content['contentSourceURL'] = url
                content['extractDate'] = datetime.now().isoformat()
                content['content'] = dict_content
                content['metadata'].append({
                    'jurisdiction': 'UK'
                })

                short_date = datetime.now().strftime("%Y-%m-%d")

                try:
                    Validator().content_schema_validator(content)
                except Exception as e:
                    print(e)
                    logger.info('Content is not valid')
                    continue

                title = dict_content['Motion']['DocumentID']

                hash_code = Common.hash(title, url, short_date)

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
                    logger.info('Scraper %s : Completed', url)

        logger.info('Scraper %s : Completed', PREFIX)

    except Exception as e:
        logger.exception(e)


if __name__ == '__main__':
    run('test', 'test')
