#### Elastic commands help

- ###### Change folder path
```
cd ./services/content
```
- ###### Create the index
```
./bin/elastic-run --env=dev --index=content --action=create
```
- ###### Delete the index
```
./bin/elastic-run --env=dev --index=content --action=delete
```
- ###### Index the content
```
./bin/elastic-run --env=dev --index=content --action=index
```