import os
import subprocess

ENV = os.environ['SERVERLESS_STAGE']

def run(event, context):
    if ('body' not in event):
        raise ValueError(f'Message body is empty!')
    params = event['body']
    subprocess.call(['./elastic-run', '--index=' + params['index-name'], '--action=' + params['action']])
