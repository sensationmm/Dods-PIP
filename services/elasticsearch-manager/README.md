#### Elastic commands helper

- ###### Change folder path
```
cd ./services/elasticsearch-manager
```
- ###### Create the index
```
./bin/elastic-run --index=content --action=create
```
- ###### Delete the index
```
./bin/elastic-run --index=content --action=delete
```
- ###### Index the content
```
./bin/elastic-run --index=content --action=index
```
- ###### Delete the data from index
```
./bin/elastic-run --index=content --action=delete-data
```