#!/usr/bin/env python

"""
Serverless task handler for the Commons Oral Questions API.

* https://dods-support.atlassian.net/browse/DOD-1477
"""

import logging
import logging.config
from common import clean_date_argument
from commons_oral_questions import import_content
from datetime import datetime

logging.config.fileConfig('logging.ini', disable_existing_loggers=False)
logger = logging.getLogger(__name__)


def run(event, context):

    try:

        source_date = clean_date_argument(event["source_date"])
        offset_date = clean_date_argument(event.get("offset_date"))
        import_content(source_date, offset_date)

    except Exception:  # no-qa
        logger.exception("Unexpected exception during task run")


if __name__ == "__main__":
    from commons_oral_questions import get_lambda_event_from_cli

    event = get_lambda_event_from_cli()
    run(event, None)
