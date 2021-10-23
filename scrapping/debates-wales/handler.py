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
from lxml import html, etree


BUCKET = os.environ['CONTENT_BUCKET']
PREFIX = os.environ['KEY_PREFIX']
content_type = 'Debates (Wales)'

content_template_file_path = os.path.abspath(os.curdir)+'/templates/content_template.json'
config = Config().config_read(("config.ini"))

def run(event, context):
    logger.debug('Starting scrapping process with BUCKET: "%s", prefix: "%s" ', BUCKET, PREFIX)
    s3 = boto3.client('s3')
    try:
        scraper_url = config.get('parser', 'sourceUrl', fallback=None)
        for i in range(-10, 5, 1):
            date = datetime.datetime.now() + datetime.timedelta(i)
            day = date.day
            month = date.month
            year = date.year
            print("###################################################################")
            print("Date=>", day, "/", month, "/", year)

            j = 1
            Insert_Rows = []
            while True:
                print("Inside the While Looop")
                mainUrl = scraper_url.format(
                    year=year, month=month, day=day, PageNumber=j)

                print("mainUrl::", mainUrl)
                response = requests.get(mainUrl)
                if response.url == "http://record.assembly.wales/Error/Error" or response.url == "https://record.assembly.wales/Error/Error":
                    break
                print(mainUrl)
                content = response.content.decode('utf-8', errors='ignore')

                for meetingID in re.findall(r'href\=\\\"\.\.([^>]*?)\\"', str(content), re.I):
                    meetingID = re.sub(r'\/Meeting\/', '', str(meetingID))
                    # meetingID=6049
                    MeetingUrl = 'http://record.assembly.wales/Plenary/' + str(meetingID)
                    print("meetingID::", meetingID)
                    try:
                        html_content = get_qa(meetingID, MeetingUrl)
                        final_content = Common().get_file_content(content_template_file_path)
                        final_content['contentType'] = content_type
                        final_content['contentSource'] = config.get('parser', 'contentSource')
                        final_content['contentSourceURL'] = MeetingUrl
                        final_content['extractDate'] = datetime.now().isoformat()
                        final_content['content'] = {
                            'html_content': html_content
                        }

                        short_date = datetime.now().strftime("%Y-%m-%d")
                        try:
                            Validator().content_schema_validator(final_content)
                        except Exception as e:
                            logger.info('Content is not valid')
                            continue

                        hash_code = Common.hash(html_content, MeetingUrl, short_date)

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
                            logger.info('Scraper %s : Completed', MeetingUrl)
                    except:
                        continue
                # print ("Answers::",Answers)
                # data = etree.tostring(Answers, pretty_print=True, encoding='UTF-8', xml_declaration=True)
                # with open("Test.xhtml",'w')as f:
                # f.write(Answers)
                # break
                # break
                if re.findall(r'(?:\"|\')MoreToShow(?:\"|\')\s*\:\s*true', str(content), re.I):
                    j += 1
                else:
                    break
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


def get_qa(meetingID, MeetingUrl):
    # answers = etree.Element("Answers")
    response = requests.get(
        'http://record.assembly.wales/XMLExport/Download?meetingID={}&xmlDownloadType=EnglishTranscript'.format(
            meetingID)).content
    # response = requests.get('http://record.assembly.wales/XMLExport/Download?meetingID={}&xmlDownloadType=EnglishTranscript'.format('5568')).content
    tree = etree.fromstring(response)

    elementsList = tree.findall('XML_Plenary_English')
    processed_agendas = []
    for id, element in enumerate(elementsList):
        # print ("Count::",id)
        html = '<html><head><meta charset="utf-8"/></head><body>'
        if element.find('contribution_type').text == "C":
            agendaID = elementsList[id].find('Agenda_Item_ID').text

            # if agendaID in processed_agendas:
            # continue
            processed_agendas.append(agendaID)

            title, MeetingDate, SessionStarttime, Volume = '', '', '', ''
            title_debate = elementsList[id - 1].find('contribution_type').text
            # print ("title_debate::",title_debate)
            # input()
            if elementsList[id - 1].find('contribution_type').text == "B":
                title = elementsList[id - 1].find('Contribution_English').text
                MeetingDate = elementsList[id].find('ContributionTime').text
                # title = elementsList[id].find('Agenda_item_english').text
                if title is None:
                    continue

                html = html + '<h2>' + str(title) + '</h2>'
                html = html + '<div class="debateDate">' + str(MeetingDate) + '</div>'

                print("MeetingDate::", MeetingDate)
                SessionStarttime = DateFormat1(MeetingDate)
                html = html + '<div class="SessionStarttime">' + SessionStarttime + '</div>'
                if Volume:
                    html = html + '<div class="volume">' + Volume + '</div>'

                if MeetingDate:
                    startyear = parse(str(MeetingDate)).year
                    html = html + '<div class="StartYear">' + str(startyear) + '</div>'
                    html = html + '<div class="EndYear">' + str(startyear + 1) + '</div>'

                AnswerText = ''
                Time_Consolidated = []
                for contribution in elementsList[id:]:
                    # for contribution in elementsList[id+1:]:
                    BlockTime, BlockColumn, Member, Answer = '', '', '', ''
                    if re.findall(r'C|V|I', contribution.find('contribution_type').text) and contribution.find(
                            'Agenda_Item_ID').text == agendaID:
                        BlockTime = contribution.find('ContributionTime').text
                        Member = contribution.find('Member_name_English').text
                        Answer = contribution.find('Contribution_English').text
                        Answer = re.sub(r'\s*<p[^>]*?>\s*', '<p class="hs_Para">', str(Answer))
                        Answer = re.sub(r'<br>', '<br />', str(Answer))
                        Answer = re.sub(r'\&nbsp\;', ' ', str(Answer))
                        Answer = re.sub(r'\s\s+', ' ', str(Answer))
                        # print ("BlockTime::",BlockTime)
                        # print ("Answer::",Answer)
                        if BlockTime:
                            BlockTime = DateFormat1(BlockTime)

                        AnswerText = AnswerText + """<div class="AnswerText">
							<div class="BlockTime">{BlockTime}</div>
							<div class="BlockColumn">{BlockColumn}</div>
							<h3>{Member}</h3>
							{Answer}
						</div>""".format(BlockTime=BlockTime, BlockColumn=BlockColumn, Member=Member, Answer=Answer)

                        Time_Consolidated.append(BlockTime)
                    else:
                        break

                try:
                    if Time_Consolidated[-1]:
                        html = html + '<div class="SessionEndtime">' + str(
                            DateFormat1(Time_Consolidated[-1])) + '</div>'
                except:
                    pass
                html = html + AnswerText
                html = html + '</body></html>'
    return html