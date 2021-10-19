import requests
from lib.data_model import DataModel
from urllib.parse import urljoin
from lib.logger import logger
import re
import boto3
import os
from datetime import datetime
from json import dumps
from lib.common import Common
from lib.configs import Config
from lib.validation import Validator
from dateutil.parser import parse


BUCKET = os.environ['CONTENT_BUCKET']
PREFIX = os.environ['KEY_PREFIX']
content_type = 'Debates (Northern Ireland)'

content_template_file_path = os.path.abspath(os.curdir)+'/templates/content_template.json'
config = Config().config_read(("config.ini"))

def run(event, context):
    logger.debug('Starting scrapping process with BUCKET: "%s", prefix: "%s" ', BUCKET, PREFIX)
    s3 = boto3.client('s3')
    try:
        #
        # Insert scraper specific code here
        #
        scraper_url = config.get('parser', 'sourceUrl', fallback=None)
        content = requests.get(scraper_url).content.decode('utf-8')
        links = re.findall(r'<a[^>]*?href\=\"([^>]*?)\"[^>]*?>\s*View\s*<\/a>', content)
        for url in links:
            short_date = datetime.now().strftime("%Y-%m-%d")
            url = urljoin(scraper_url, url)
            print("URL : ", url)
            res1 = requests.get(url)
            print("StatusCode::", res1.status_code)
            debate_content = res1.content.decode('utf-8', errors='ignore')
            debate_content = re.sub(r'(<div[^>]*?\'Header1\'>)', r'<block1><block2>\1', debate_content,
                                   flags=re.IGNORECASE)
            debate_content = re.sub(r'<div\s*class\=\"top\">\s*[\w\W]*?\s*<\/div>', '', debate_content,
                                   flags=re.IGNORECASE)

            # Debate_section,Volume='',''
            debate_date = regex(r'Official\s*Report\s*\:\s*([\w\W]*?)<\/span>', debate_content)
            debate_date = clean(debate_date)
            print("Debate_date :: ", debate_date)

            for block in re.findall(r'(<block2>[\w\W]*?(?:<block1>|<\/main>))', debate_content):
                debate_title = regex(r'<div[^>]*?Header1\'>\s*([\w\W]*?)\s*<\/div>', block)
                debate_title = clean(debate_title)
                print("################### ", debate_title, "###################")

                if debate_title == 'Speaker\'s Business' or debate_title == 'Oral Answers to Questions':
                    continue

                block = re.sub(r'(<div[^>]*?\'Header3\'>)', r'<blk1><blk2>\1', block, flags=re.IGNORECASE)

                for block1 in re.findall(r'(<blk2>[\w\W]*?(?:<blk1>|$))', block):

                    debate_title_subtitle = regex(r'<div[^>]*?Header3\'>([\w\W]*?)<\/div>', block1)
                    debate_title_subtitle = clean(debate_title_subtitle)
                    block1 = re.sub(
                        r'(<div\s*class\=\'Contribution\'>\s*<a\s*name\=\'[\d]+\'>\s*<\/a>\s*<p>\s*<b>[\w\W]*?<\/b>)',
                        r'<Member1><Member2>\1', block1, flags=re.IGNORECASE)

                    html_content = PayloadCreation(debate_title_subtitle, block1, debate_date)

                    final_content = Common().get_file_content(content_template_file_path)
                    final_content['contentType'] = content_type
                    final_content['contentSource'] = config.get('parser', 'contentSource')
                    final_content['contentSourceURL'] = url
                    final_content['extractDate'] = datetime.now().isoformat()
                    final_content['content'] = {
                        'html_content': html_content
                    }
                    content['metadata']['jurisdiction'] = 'UK'

                    short_date = datetime.now().strftime("%Y-%m-%d")
                    try:
                        Validator().content_schema_validator(final_content)
                    except Exception as e:
                        logger.info('Content is not valid')
                        continue

                    hash_code = Common.hash(debate_title_subtitle, url, short_date)

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
                        logger.info('Object upload respondend with: %s', s3_response)
                        asset = DataModel()
                        asset.document_hash = hash_code
                        asset.save()
                        logger.info('Scraper %s : Completed', url)
    except Exception as e:
        logger.exception(e)


def regex(pattern, data):
    data = re.findall(pattern, data, re.IGNORECASE)
    return data[0] if data else ''


def DateFormat(Input):
    Input = re.sub(r'\.', ':', Input)
    dt = parse(Input)
    FormattedTime = (dt.strftime('%Y-%m-%dT%H:%M:%S'))
    return (FormattedTime)


def DateFormat1(Input):
    Input = re.sub(r'\.', ':', Input)
    dt = parse(Input)
    FormattedTime = (dt.strftime('%H:%M:%SZ'))
    return (FormattedTime)


def clean(text):
    text = re.sub(r"<[^>]*?>", " ", str(text))
    text = re.sub(r"\s\s+", " ", str(text))
    text = re.sub(r"^\s+\s*", "", str(text))
    text = re.sub(r"\s+\s*$", "", str(text))
    return text


##### Payload Creation #####
def PayloadCreation(titleValue, ContentBlock, DebateDate):
    try:
        sourceContent = '<h2>' + str(titleValue) + '</h2>'
        sourceContent = sourceContent + '<div class="debateDate">' + str(DateFormat(DebateDate)) + "</div>"

        if DebateDate is not None:
            startyear = parse(str(DebateDate)).year
            sourceContent = sourceContent + '<div class="StartYear">' + str(startyear) + '</div>'
            sourceContent = sourceContent + '<div class="EndYear">' + str(startyear + 1) + '</div>'

        time = []
        for MemberBlock in re.findall(r'<Member2>([\w\W]*?)(?:<Member1>|$)', ContentBlock):

            DateAndTime = regex(r'Time\'>([\w\W]*?)<\/div>', MemberBlock)
            MemeberName = regex(r'<a\s*name\=\'[\d]+\'>\s*<\/a>\s*<p>\s*<b>([\w\W]*?)<\/b>', MemberBlock)
            ContentBlk = regex(r'<a\s*name\=\'[\d]+\'>\s*<\/a>\s*<p>\s*<b>[\w\W]*?<\/b>([\w\W]*?)$', MemberBlock)

            if DateAndTime:
                DateAndTime = re.sub(r'noon', 'pm', DateAndTime, flags=re.IGNORECASE)

            DateAndTime = clean(DateAndTime)
            MemeberName = clean(MemeberName)
            MemeberName = re.sub(r'\'\)\;\"\>|\:\s*$', '', MemeberName, flags=re.IGNORECASE)

            Blocktime = ''
            if DateAndTime:
                Blocktime = DateAndTime
                time.append(Blocktime)
            else:
                try:
                    Blocktime = time[-1]
                except:
                    pass

            if Blocktime != '':
                Blocktime = DateFormat1(Blocktime)

            sourceContent = sourceContent + '<div class="AnswerText">'
            sourceContent = sourceContent + '<div class="BlockTime">' + str(Blocktime) + '</div>'
            sourceContent = sourceContent + '<h3>' + str(MemeberName) + '</h3>'

            ContentBlk = re.sub('\s*<(?:br|BR)\s*(?:\/)?>\s*', '|', ContentBlk)
            ContentBlk = re.sub('\s*[\|]+\s*', '</p><p>', ContentBlk)
            if not re.findall(r'^\s*<p>', ContentBlk):
                ContentBlk = re.sub('^\s*', '<p>', ContentBlk)
            ContentBlk = re.sub(r'\s*<(?!(?:\/)?p)([^>]*?)>\s*', '', ContentBlk)
            ContentBlk = re.sub('\s*<p>\s*', '<p class="hs_Para">', ContentBlk)

            sourceContent = sourceContent + ContentBlk
            sourceContent = sourceContent + '</div>'

        SessionContent, SessionStarttime, SessionEndtime = '', '', ''
        print("time::", time)
        if time:
            SessionStarttime = time[0]
            SessionEndtime = time[-1]
            SessionContent = SessionContent + '<div class="SessionStarttime">' + str(
                DateFormat1(SessionStarttime)) + '</div>'
            SessionContent = SessionContent + '<div class="SessionEndtime">' + str(
                DateFormat1(SessionEndtime)) + '</div>'

        metaContent = '<meta charset="utf-8"/>'
        htmlFile = '<html><head>' + metaContent + '</head><body>' + str(SessionContent) + str(
            sourceContent) + '</body></html>'
        return htmlFile
    except Exception as e:
        logger.exception(e)