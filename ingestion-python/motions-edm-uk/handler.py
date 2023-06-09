#!/usr/bin/env python

"""
Serverless task handler for the Hansard API.

* https://dods-support.atlassian.net/browse/DOD-1255
"""

import logging
import logging.config
from edm import import_content
from datetime import datetime

logging.config.fileConfig('logging.ini', disable_existing_loggers=False)
logger = logging.getLogger(__name__)


def run(event, context):
    try:
        if event["date"] == "today":
            logger.info(f"Got special date 'today'")
            import_content(datetime.today().strftime('%Y-%m-%d'))
        else:
            import_content(event["date"])
    except Exception:  # no-qa
        logger.exception("Unexpected exception during task run")


if __name__ == "__main__":
    from edm import get_lambda_event_from_cli

    event = get_lambda_event_from_cli()
    run(event, None)
