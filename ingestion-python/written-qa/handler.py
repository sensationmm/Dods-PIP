#!/usr/bin/env python

"""
Serverless task handler for the Hansard API.

* https://dods-support.atlassian.net/browse/DOD-1255
"""

import logging
import logging.config
from written_qa import import_content
from datetime import datetime


logging.config.fileConfig('logging.ini', disable_existing_loggers=False)
logger = logging.getLogger(__name__)


def run(event, context):
    try:
        if event["date"] == "today":
            logger.info(f"Got special date 'today'")
            import_content(
                datetime.today().strftime('%Y-%m-%d'),
                event["answered_state"]
            )

        else:
            import_content(event["date"], event["answered_state"])
    except Exception:  # no-qa
        logger.exception("Unexpected exception during task run")


if __name__ == "__main__":
    from written_qa import get_lambda_event_from_cli

    event = get_lambda_event_from_cli()
    run(event, None)
