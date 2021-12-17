import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { HttpSuccessResponse, config } from '../../domain';
import S3 from 'aws-sdk/clients/s3';
import { getFromS3 } from '../../utility/aws'

const BUCKET = config.aws.TAXONOMY_TREE_BUCKET


const TAXONOMIES = [
    'Topics',
    'Organisations',
    'Geography',
    'People'
]
export const taxonomyTree = async (): Promise<APIGatewayProxyResultV2> => {

    let trees: any = {};
    await Promise.all(TAXONOMIES.map(async (taxonomy: string) => {
        const params: S3.GetObjectRequest = {
            Bucket: BUCKET,
            Key: taxonomy + '.json'
        };
        console.log(params)
        const response = await getFromS3(params);
        console.log(response)
        //@ts-ignore
        trees[taxonomy] = JSON.parse(response.Body.toString('utf-8'))
    }));

    return new HttpSuccessResponse(trees);
};