# Python ingestion scripts

These scripts are for creating serverless lambda functions which pull data down
into S3 and maintain a record store in Dynamodb for purposes of deduplication
and tracking.

The general setup for a folder is:

- `__init__.py`: for python module referencing, empty
- `common.py -> ../common.py`: symlink to the common AWS and model related
  methods
- `handler.py`: main lambda task for serverless, with a CLI wrapper for
  `__main__`
- `hansard.py`: library code for the particular service, the main ingestion
  parsing functions
- `logging.ini -> ../logging.ini`: symlnk for the common logging setup
- `package-lock.json`: for serverless
- `package.json`: for serverless
- `Pipfile -> ../Pipfile`: symlink to the Python virtualenv packages
- `Pipfile.lock -> ../Pipfile.lock`:
- `serverless.yml`: main lambda function configuration
- `requirements.txt -> ../requirements.txt`: symlink like Pipfile (frozen from
  that)

These all essentially work as follows:

- A date & any other context is parsed in some way (provided by invoking or
  through CLI locally or by calling code direct) and passed into the library
  `import_content` function
- This will start looping through the content, on a case by case basis which
  depends on how the URLs and responses themselves are structured, but
  ultimately this creates a mapped document at some individual level, associated
  to the date the ingestion ran
- Each document has an associated external & internal ID which will be unique.
  These along with the title and the content hash are stored in Dynamodb.
- If this is a new record, or the hash is different for a pre-existing document
  (identified by it's external ID), the content is dumped to JSON and wrote to
  an S3 bucket with a key that is based on the particular service, date &
  document ID.
