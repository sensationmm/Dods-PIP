#! /bin/sh

# Temporary solution since we can't keep adding these by hand here.
export SERVERLESS_STAGE=dev
export SERVERLESS_PORT=3000
export GET_USER_ENDPOINT=http://localhost:3000/dev/user
export GET_USERBYNAME_ENDPOINT=http://localhost:3000/dev/userByName
export GET_ROLE_ENDPOINT=http://localhost:3000/dev/role