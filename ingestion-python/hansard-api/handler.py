#!/usr/bin/env python

"""
Serverless task handler for the Hansard API.

* https://dods-support.atlassian.net/browse/DOD-1255
"""

import logging
import logging.config
from hansard import import_content


logging.config.fileConfig('logging.ini', disable_existing_loggers=False)
logger = logging.getLogger(__name__)


def run(event, context):
    try:
        import_content(context["date"], context["house"])
    except Exception:  # no-qa
        logger.exception("Unexpected exception during task run")


if __name__ == "__main__":
    from hansard import get_context_from_cli

    context = get_context_from_cli()
    run(None, context)
