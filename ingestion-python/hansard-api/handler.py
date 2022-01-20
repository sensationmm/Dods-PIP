"""
Serverless task handler for the Hansard API.

* https://dods-support.atlassian.net/browse/DOD-1255
"""

import os
from datetime import datetime
from json import loads, dumps

from lib.logger import logger
from lib.configs import Config


# BUCKET = os.environ["CONTENT_BUCKET"]
# PREFIX = os.environ["KEY_PREFIX"]

content_type = "Hansard HoC API Feed"

content_template_file_path = os.path.join(
    os.path.abspath(os.curdir), "/templates/content_template.json"
)
config = Config().config_read(("config.ini"))


from hansard import import_content

def run(event, context):
    try:
        import_content(context["date"], context["house"])
    except Exception:
        logger.exception("Unexpected exception during task run")
