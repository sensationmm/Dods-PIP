const AWS = require("aws-sdk");

AWS.config.update({
    region: "eu-west-1",
});
export default new AWS.DynamoDB.DocumentClient()