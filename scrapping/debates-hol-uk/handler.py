import os
import re
from datetime import datetime
from json import dumps
from urllib.parse import urljoin
import requests

import boto3
from parsel import Selector

from lib.common import Common
from lib.configs import Config
from lib.data_model import DataModel
from lib.logger import logger
from lib.validation import Validator
import uuid

from inner_utils import clean, payload_creation, content_document_date

BUCKET = os.environ['CONTENT_BUCKET']
PREFIX = os.environ['KEY_PREFIX']

config = Config().config_read("config.ini")
content_template_file_path = os.path.abspath(os.curdir) + '/templates/content_template_new.json'

def run(event, context):
    logger.debug(
        'Starting scrapping process with BUCKET: "%s", prefix: "%s" ', BUCKET, PREFIX)
    s3 = boto3.client('s3')

    try:
        # get main url from config
        main_url = config.get('parser', 'sourceUrl')
        response = requests.get(main_url).content

        content = Selector(text=response.decode('utf-8', errors='ignore'))
        links = content.xpath(
            "//tr[@class='calendar-week']/descendant::a[contains(@aria-label,'This day has business')]/@href"
        )

        # Looping the calendar if aria-label value contains ('This day has business')
        for i, active_links in enumerate(links[::-1]):
            # concat main url with element href content
            qa_link = urljoin(main_url, active_links.extract())
            # apparently this if is to process only the first element of links[::-1] - it is, the most recent one
            # would leave it like this by the time, but code can be improved
            if i == 1:
                break

            # get new page content
            pageSource = requests.get(qa_link)

            if not re.findall(
                    r'<div[^>]*?class=\"highlight[^>]*?highlight-info\">'
                    r'\s*From\s*the\s*corrected\s*\(daily\)\s*version',
                    str(pageSource.text),
                    re.IGNORECASE):
                print("**** Not Matched ****")
                continue

            list_page_content = Selector(text=pageSource.text)

            for content_sources in list_page_content.css('div.content > div.card-folder'):
                content_location_name = clean(
                    content_sources.css('h2').extract_first())
                print("content_location_name::", content_location_name)

                # Looping the each block
                for list_block in content_sources.css('a.card'):

                    link = list_block.css('a.card::attr(href)').extract_first()
                    title = clean(list_block.css(
                        'div.primary-info::text').extract_first())

                    if title is None or title == '':
                        continue

                    link = urljoin(main_url, link)
                    QAResponse = requests.get(link)
                    pageContent = QAResponse.content.decode(
                        'utf-8', errors='ignore')

                    selectPageContent = Selector(text=QAResponse.text)
                    extractedDate = selectPageContent.css('h2.heading-level-3::text').get()
                    contentDateTime = content_document_date(extractedDate)
                    contentDateTimeObject = datetime.strptime(contentDateTime, '%A %d %B %Y')
                    contentDateTime = contentDateTimeObject.isoformat()

                    if re.search(r'<p\s*class=\"hs_DebateType\">Question</p>', pageContent) is not None or re.search(
                            r'<QuestionText\s*', pageContent) is not None:
                        print("link Oral Answer::", link)
                        print("title Oral Answer::", title)
                        continue
                    else:
                        print("link Debates::", link)
                        print("title Debates::", title)

                    final_content = Common().get_file_content(content_template_file_path)
                    final_content['documentId'] = uuid.uuid4().hex
                    final_content['documentTitle'] = title
                    final_content['organisationName'] = ''
                    final_content['sourceReferenceFormat'] = 'text/html'
                    final_content['sourceReferenceUri'] = link
                    final_content['createdBy'] = ''
                    final_content['schemaType'] = ''
                    final_content['contentSource'] = config.get('parser', 'contentSource')
                    final_content['informationType'] = config.get('parser', 'schemaType')
                    final_content['contentDateTime'] = contentDateTime
                    final_content['createdDateTime'] = datetime.now().isoformat()
                    final_content['ingestedDateTime'] = ''
                    final_content['taxonomyTerms'] = []
                    final_content['originalContent'] = payload_creation(pageContent)
                    final_content['documentContent'] = ''

                    try:
                        Validator().content_schema_validator(final_content)
                    except Exception as e:
                        logger.info('Content is not valid')
                        print(e)
                        continue

                    short_date = datetime.now().strftime("%Y-%m-%d")
                    hash_code = Common.hash(title, link, short_date)
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
                        logger.info(
                            'Object upload responded with: %s', s3_response)
                        asset = DataModel()
                        asset.document_hash = hash_code
                        asset.save()
                        logger.info('Scraper %s : Completed', link)

    except Exception as e:
        logger.exception(e)
        raise e


if __name__ == '__main__':
    run({}, {})
