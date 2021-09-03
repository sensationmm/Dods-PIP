import requests
from lib.data_model import DataModel
from lib.logger import logger
import boto3
import os
from datetime import datetime
from parsel import Selector
from json import loads, dumps
import xmltodict
from lib.common import Common
from lib.configs import Config
from lib.validation import Validator
import re
from urllib.parse import urljoin

BUCKET = os.environ['CONTENT_BUCKET']
PREFIX = os.environ['KEY_PREFIX']

content_template_file_path = os.path.abspath(os.curdir)+'/templates/content_template.json'
config = Config().config_read(("config.ini"))
content_type = config.get('parser', 'informationType', fallback=None)
content_source = config.get('parser', 'contentSource', fallback=None)


def run(event, context):
    logger.debug('Starting scrapping process with BUCKET: "%s", prefix: "%s" ', BUCKET, PREFIX)
    s3 = boto3.client('s3')
    try:
        mainUrl = config.get('parser', 'sourceUrl', fallback=None)
        response = requests.get(mainUrl)
        content = Selector(text=response.content.decode('utf-8', errors='ignore'))
        links = content.xpath(
            "//tr[@class='calendar-week']/descendant::a[contains(@aria-label,'This day has business')]/@href")

        Insert_Rows = [] # Is this really needed ? don't see where is being used
        # Looping the calendar if aria-label value is ('This day has business')
        for i, active_links in enumerate(links[::-1]):
            qalink = urljoin(mainUrl, active_links.extract())
            if i == 2:
                break
            pageSource = requests.get(qalink)
            if not re.findall(
                    r'<div[^>]*?class\=\"highlight[^>]*?highlight\-info\">\s*From\s*the\s*corrected\s*\(daily\)\s*version',
                    str(pageSource.text), re.IGNORECASE):
                print("**** From the uncorrected (rolling) feed ****")
                continue
            list_page_content = Selector(text=pageSource.text)
            Insert_Rows = []

            # Looping the each block
            for list_block in list_page_content.css('div.contents > a.card'):
                short_date = datetime.now().strftime("%Y-%m-%d")
                Link = list_block.css('a.card::attr(href)').extract_first()
                Title = clean(list_block.css('div.primary-info::text').extract_first())

                if Title is None or Title == '':
                    continue

                hash_code = Common.hash(Title, Link)

                Link = urljoin(mainUrl, Link)

                QAResponse = requests.get(Link, headers={
                    "Host": "hansard.parliament.uk",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36"})
                pageContent = QAResponse.content.decode(
                    'utf-8', errors='ignore')

                if re.search(
                        r'(?:<div[^>]*?\"hs_DebateType\"[^>]*?>[^>]*?(?:<p>)?Question[^>]*?<\/p>|<Question[^>]*?>)',
                        str(pageContent)) is not None:
                    print("Link Oral Answer::", Link)
                    print("Title Oral Answer::", Title)
                else:
                    print("Link Debates::", Link)
                    print("Title Debates::", Title)
                    continue

                QAResponse = requests.get(Link)
                QA_Page_Content = QAResponse.content.decode(
                    'utf-8', errors='ignore')
                page_content = Selector(text=QA_Page_Content)

                Organization = ''
                if page_content.css('div.breadcrumb > ul > li:nth-last-child(2)'):
                    Organization = clean(page_content.css(
                        'div.breadcrumb > ul > li:nth-last-child(2)').extract_first())
                else:
                    Organization = ''

                QA_Page_Content = payloadCreation(QA_Page_Content)

                soup = Common.convert_2_xhtml(QA_Page_Content)
                soup = specific_formatting(soup)

                document = object
                try:
                    document = DataModel.get(hash_code)
                except DataModel.DoesNotExist:
                    logger.info(DataModel.DoesNotExist.msg)

                if hasattr(document, 'document_hash'):
                    continue
                else:
                    content = Common().get_file_content(content_template_file_path)
                    content['contentType'] = content_type
                    content['contentSource'] = content_source
                    content['contentSourceURL'] = Link
                    content['extractDate'] = datetime.now().isoformat()
                    content['content'] = {
                        'html_content': soup
                    }
                    try:
                        Validator().content_schema_validator(content)
                    except Exception as e:
                        logger.info('Content is not valid')
                        continue

                    s3_response = s3.put_object(
                        Body=dumps(soup).encode('UTF-8'),
                        Bucket=BUCKET,
                        Key=(PREFIX + '/' + short_date + '/' + hash_code)
                    )
                    logger.info('Object upload respondend with: %s', s3_response)
                    asset = DataModel()
                    asset.document_hash = hash_code
                    asset.save()
                    logger.info('Scraper %s : Completed', Link)
    except Exception as e:
        logger.exception(e)

def clean(text):
    text = re.sub(r"<[^>]*?>", " ", str(text))
    text = re.sub(r"\s+\s*", " ", str(text))
    text = re.sub(r"^\s+\s*", "", str(text))
    text = re.sub(r"\s+\s*$", "", str(text))
    return text


def clean_quest(input):
    input = re.sub(r'<[^>]*?>', '', input)
    input = re.sub(r'\s\s*', ' ', input)
    input = re.sub(r'^\s*|\s*$', '', input)
    input = re.sub(r'^T?\d+\s*\.\s*', '', input)
    return input


def specific_formatting(pagecontent):
    for div in pagecontent.find_all("div", {'class': 'share-bar'}):
        div.decompose()
    for div in pagecontent.find_all("div", {'class': 'col-lg-2 share'}):
        div.decompose()
    for div in pagecontent.find_all("div", {'class': 'content-item'}):
        if div.find_all("p", {'class': 'hs_TabledBy'}):
            continue
        else:
            div.decompose()
    pagecontent = pagecontent.prettify().replace('<div class="content-item" id="contribution-id">',
                                                 '<div class="content-item" id="contribution-id"></div><div class="content-item" id="contribution-id">')
    return pagecontent


def payloadCreation(pageContent):

    # pageContent = re.sub(
    # r'(<div[^>]*?class\=\"[^>]*?debate-item[^>]*?>)', r'<block1><block2>\1', pageContent)
    pageContent = re.sub(r'<p\s*class\=\"hs_para\">\s*<\/p>', '', pageContent)

    pageContent = re.sub(
        r'class\=\"debate-item\s*debate-item-contributiondebateitem\"', 'class="content-item" id="contribution-id" ', pageContent)
    tabled_date = clean(re.findall(
        r'<h2[^>]*?heading-level-3[^>]*?>[^>]*?debated\s*[^>]*?([\d]+[^>]*?)\s*<\/h2>', pageContent, re.IGNORECASE)[0])

    tabled_date = re.sub(r'(?:February|Febuary)', 'Febuary', tabled_date)

    print("tabled_date::", tabled_date)
    pageContent = re.sub(r'<h1[^>]*?>([\w\W]*?)</h1>',
                         r'<div class="title">\1</div>', pageContent)
    date_substitute_regex = r'</h2><div class="debate-date"><strong>' + \
        str(tabled_date) + r'</strong></div>'
    pageContent = re.sub(r'<\/h2>', date_substitute_regex, pageContent)

    pageContent = re.sub(
        r'<div[^>]*?class\=\"primary\-text\"[^>]*?>\s*([\w\W]*?)\s*<\/div>\s*(?:<div[^>]*?class\=\"secondary\-text\"[^>]*?>\s*([\w\W]*?)\s*<\/div>)?', r'<h2 class="memberLink">\1 \2</h2>', pageContent)

    return pageContent