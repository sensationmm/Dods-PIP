import logging
import os


logger = logging.getLogger()


BUCKET = os.environ['CONTENT_BUCKET']
PREFIX = os.environ['KEY_PREFIX']
content_type = 'Debates (Wales)'


def run(event, context):
    logger.debug('Starting scrapping process with BUCKET: "%s", prefix: "%s" ', BUCKET, PREFIX)

    try:
        logger.info('Scraper %s : Completed', PREFIX)
    except Exception as e:
        logger.exception(e)
