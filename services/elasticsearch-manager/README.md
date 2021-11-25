#### Elastic commands helper

- ###### Change folder path
```
cd ./services/elasticsearch-manager
```
- ###### Create the index
```
./elastic-run --index=content --action=create
```
- ###### Delete the index
```
./elastic-run --index=content --action=delete
```
- ###### Index the content
```
./elastic-run --index=content --action=index
```
- ###### Delete the data from index
```
./elastic-run --index=content --action=delete-data
```