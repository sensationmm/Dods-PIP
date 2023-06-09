import logging
import sys
"""
All lambda methods use this logging config.
Provides a single place where all log config/level/formatting is setup so that one
can see source file, line numbers, and any other desired log fields. 
"""
logger = logging.getLogger()
for h in logger.handlers:
    logger.removeHandler(h)
h = logging.StreamHandler(sys.stdout)
# use whatever format you want here
FORMAT = '%(name)s [%(filename)s:%(lineno)d] :%(levelname)8s: %(message)s'
h.setFormatter(logging.Formatter(FORMAT))
logger.addHandler(h)
logger.setLevel(logging.INFO)
# Suppress the more verbose modules
