let crypto;
const { Client } = require('@elastic/elasticsearch')
try {
  crypto = require('crypto'); // eslint-disable-line import/no-extraneous-dependencies
} catch (err) {
  console.log('crypto support is disabled!');
}

const graphPubKey = process.env.GRAPH_PUB_KEY
const esCloudId = process.env.ES_CLOUD_ID
const esKeyId = process.env.ES_KEY_ID
const esApiKey = process.env.ES_API_KEY

exports.dumper =  async function(event, context) {
    console.log('## ENVIRONMENT VARIABLES: ' + serialize(process.env));
    console.log('## CONTEXT: ' + serialize(context));
    console.log('## EVENT: ' + serialize(event));

    // We need to JSON decode the JSON-LD payload
    let eventBodyJson = JSON.parse(event.body);

    let payloadValid = validatePayload(event.headers, eventBodyJson, graphPubKey);
    console.log('Payload validation returned: ', payloadValid);

    //Return error for invalid payloads
    if (! payloadValid ) {
      return '{statusCode: 406, body: "Payload validation failed}';
    }

    await addTaxonomyToES(eventBodyJson)

    return '{ statusCode: 200, body: "ok" }';
};

var serialize = function(object) {
   return JSON.stringify(object, null, 2)
};

function renameKey ( obj, oldKey, newKey ) {
  obj[newKey] = obj[oldKey];
  delete obj[oldKey];
}

function prepareTaxonomyForInsertion(taxonomy) {
    // We will use the graphologi ID as it allows easier lookups and cross checking
    taxonomy.forEach( obj => renameKey( obj, 'id', '_id' ) );

    // Rename some of the problem columns that can't be used in ES
    taxonomy.forEach( obj => renameKey( obj, 'http://purl.org/dc/terms/identifier', 'identifier' ) );
    taxonomy.forEach( obj => renameKey( obj, 'http://taxo.dods.co.uk/onto#deleted', 'deleted' ) );
    taxonomy.forEach( obj => renameKey( obj, 'http://taxo.dods.co.uk/onto#exactMatch', 'exactMatch' ) );
    taxonomy.forEach( obj => renameKey( obj, 'http://taxo.dods.co.uk/onto#legacyID', 'legacyID' ) );
    taxonomy.forEach( obj => renameKey( obj, 'http://taxo.dods.co.uk/onto#typeOfClue', 'typeOfClue' ) );
    taxonomy.forEach( obj => renameKey( obj, 'http://www.mondeca.com/system/t3#abbreviation', 'abbreviation' ) );
    taxonomy.forEach( obj => renameKey( obj, 'http://www.mondeca.com/system/t3#language', 'language' ) );

    const preparedTaxonomy = taxonomy.flatMap(doc => [{ index: { _index: 'taxonomy', ...doc} }])

    return preparedTaxonomy
}

async function saveToES(body, client) {
    const { body: bulkResponse } = await client.bulk({ refresh: true, body })

    return bulkResponse
}

async function addTaxonomyToES(taxonomy) {

    let preparedTaxonomy = prepareTaxonomyForInsertion(taxonomy)
    const client = new Client({
      cloud: {
        id: esCloudId,
      },
      auth: {
        apiKey: {
          id: esKeyId,
          api_key: esApiKey
        }
      }
    })

    const bulkResponse = saveToES(preparedTaxonomy, client)

    if (bulkResponse.errors) {
        const erroredDocuments = []
        // The items array has the same order of the dataset we just indexed.
        // The presence of the `error` key indicates that the operation
        // that we did for the document has failed.
        bulkResponse.items.forEach((action, i) => {
            const operation = Object.keys(action)[0]
            if (action[operation].error) {
                erroredDocuments.push({
                    // If the status is 429 it means that you can retry the document,
                    // otherwise it's very likely a mapping error, and you should
                    // fix the document before to try it again.
                    status: action[operation].status,
                    error: action[operation].error,
                    operation: preparedTaxonomy[i * 2],
                    document: preparedTaxonomy[i * 2 + 1]
                })
            }
        })
        console.log('## Errored DOCUMENTS: ' + JSON.stringify(erroredDocuments))
    }

    const { body: count } = await client.count({ index: 'taxonomy' })
    console.log(count)
}

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