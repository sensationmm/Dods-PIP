#!/usr/bin/env python

"""
Serverless task handler for the Hansard API.

* https://dods-support.atlassian.net/browse/DOD-1255
"""

import logging
import logging.config
from common import process_date_argument
from hansard import import_content
from datetime import datetime


logging.config.fileConfig('logging.ini', disable_existing_loggers=False)
logger = logging.getLogger(__name__)


def run(event, context):

    try:
        date = process_date_argument(event["date"])
        import_content(date, event["house"])

    except Exception:  # no-qa
        logger.exception("Unexpected exception during task run")


if __name__ == "__main__":
    from hansard import get_lambda_event_from_cli

    # https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-concepts.html#gettingstarted-concepts-event
    event = get_lambda_event_from_cli()
    run(event, None)
