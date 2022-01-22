"""
Serverless task handler for the Hansard API.

* https://dods-support.atlassian.net/browse/DOD-1255
"""

from lib.logger import logger
from hansard import import_content


def run(event, context):
    try:
        import_content(context["date"], context["house"])
    except Exception:  # no-qa
        logger.exception("Unexpected exception during task run")
