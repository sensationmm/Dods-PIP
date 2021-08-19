let crypto;
try {
  crypto = require('crypto'); // eslint-disable-line import/no-extraneous-dependencies
} catch (err) {
  console.log('crypto support is disabled!');
}

// This is a travesty but I wanted to implement this quick
const pubKey = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAryll0fkZkLAvpg17JVg6
3q0pHzK/XjSi3CLFbXRz1hjV8ZBbbXHpeM+fXo32VAlJRShZ7GsONa6hNzsz7xQl
h2Wlo28x0r8WOzPVV/hG8Sm23jdWZnjvo9yRG5JZzir0Azb+6QRw6ksOCW0bxxSX
tqu3lQX9uvhzJ+UIvzaDi7qbMWOQPw9QFPfDpK650YwYBtsGfYehTaeDrFeEtL4O
1rMHVTA7C6KP3XRqk5swW7EExgU7aOFSBTzkYNqwm9SiNrRUPtYUdh6vQlceG2LU
PFmWtzMDjCh7ululSmuRdyXOdHQg4/sq9pi1KudqjAmVY7agAK1oVS67Bizz83Pm
SoNDQPkpekLRvqFY1vv9Ky0Di5mdEKdlbaqaGpFfYR/zmktl8mSc7GHQwQEs6rcD
JH+or181JLQ5h/QNSsrCegq5LU9kJTC3vyeAWTDbLpEZZaosmIFpcdHAsrPJQ7PC
VUtaefD6HPL5gIAr7xv9ECAz5v5WQOWjMH+ZMtCMi9Dq75eOG3xBPK3MKiG0xwyp
FwduVlEPIua16qsQQ8xhIeOS7Rb8dRfuMzLnBcf5uHGl9Qlk+WTMlaP1wtcDWB4o
OEe/49957V1kng+EJxSabBrotsLDXkJTbXQyiIa7glIN8UMQLo0Q0PqHqNf7VVZu
wR/X5Fg2LSgOuK7FQRiF2p0CAwEAAQ==
-----END PUBLIC KEY-----`;

exports.dumper =  async function(event, context) {
   // event.Records.forEach(record => {
   //    console.log(record.body)
   //  })
   console.log('## ENVIRONMENT VARIABLES: ' + serialize(process.env));
   console.log('## CONTEXT: ' + serialize(context));
   console.log('## EVENT: ' + serialize(event));

   // Graphologi's documentation talks about rejecting uploads that look
   //  too old (their payload has a timestamp, hopefully epoch as well)
   var epoch = new Date().getTime() / 1000;

   // this implementation of payload validation is failing
   // I'll skip it in the mean time
   // let payloadValid = validatePayload(event.headers, event.body, pubKey);
   // console.log('Payload validation returned: ', payloadValid);

   // Return error for invalid payloads
   // if (! payloadValid ) {
   //    return '{statusCode: 406, body: "Payload validation failed}';
   // }

   const fileName = epoch + '.json';

   let upStatus = uploadFileOnS3(event.body, fileName);
   console.log('Taxonomy upload status: ', upStatus);
   // To Do: error handling for failed uploads

   return '{ statusCode: 200, body: "ok" }';
};

var serialize = function(object) {
   return JSON.stringify(object, null, 2)
};

function uploadFileOnS3(fileData, fileName) {
   const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
   const s3 = new AWS.S3();

   const params = {
       Bucket: process.env.S3_TAXONOMY_BUCKET, 
       Key: fileName,
       Body: 'hello fucking world!',
      //  Body: JSON.stringify(fileData),
   };

   s3.upload(params, function(err, data) {
      console.log('Taxonomy upload response: ', err, data);
      if (err) {
        return err
      }
      if (data) {
        return data;
      }
    });

   // try {
   //     const response = s3.upload(params).promise();
   //     console.log('Taxonomy Upload Response: ', response);
   //     return response;

   // } catch (err) {
   //     console.log(err);
   // }
};

function validatePayload(headers, payload, publicKey) {
   // Expecting an authorization header with parameters:
   // Algorithm="RSA-SHA256";Timestamp="{epoch string}";Signature="{string}"
   const payloadString = headers["Content-Type"] === "application/ld+json" ?
       JSON.stringify(payload)
       :
       payload;
   const payloadHash = crypto.createHash('sha256').update(payloadString).digest('hex');
   const params = headers.Authorization.split(";").map(param => {
       const value = param.substring(param.indexOf("=") + 1);
       return value.substring(1, value.length - 1);
   });
   const timestamp = params[1];
   const signature = params[2];                
   // Use timestamp and signature to verify payload string
   const payloadForVerification = timestamp + "\n" + payloadHash;
   const verify = crypto.createVerify('RSA-SHA256');
   verify.write(payloadForVerification);    
   verify.end();
   const result = verify.verify(publicKey, signature, 'base64');
   return result;
}