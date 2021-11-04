// import md5Hex from 'md5-hex';
import S3 from 'aws-sdk/clients/s3';
var s3 = new S3()

// export type Method =
//     | 'get' | 'GET'
//     | 'delete' | 'DELETE'
//     | 'head' | 'HEAD'
//     | 'options' | 'OPTIONS'
//     | 'post' | 'POST'
//     | 'put' | 'PUT'
//     | 'patch' | 'PATCH'
//     | 'purge' | 'PURGE'
//     | 'link' | 'LINK'
//     | 'unlink' | 'UNLINK'

// export interface RequestConfig {
//     url?: string;
//     method?: Method;
//     headers?: any;
//     params?: any;
//     data?: any;
// }

export function getFromS3(params: S3.GetObjectRequest) {
    return s3.getObject(params).promise();
}

export function putInS3(params: S3.PutObjectRequest) {
    return s3.putObject(params).promise();
}
