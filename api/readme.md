#To View in docker swagger-ui #

    docker pull swaggerapi/swagger-ui
    docker run -p 80:8080 -e SWAGGER_JSON=/ClientAccount.yml.json -v /:. swaggerapi/swagger-ui