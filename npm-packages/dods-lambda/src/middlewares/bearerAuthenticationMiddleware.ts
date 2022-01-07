import { APIGatewayProxyEvent } from "aws-lambda";
import { AsyncLambdaMiddlewareWithServices } from "nut-pipe";
import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import axios from 'axios';

type JwtHeaderType = { alg: 'RS256', kid: string }
type JwkKeyType = JwtHeaderType & { e: string, kty: 'RSA', n: string, use: 'sig' }
type JwkType = { keys: Array<JwkKeyType> }

const { JWK_URL } = process.env;

if (!JWK_URL) {
    throw new Error('JWK_URL environment variable is not defined.');
}

export const getJwk = async () => {
    const jwk = await axios.get(JWK_URL);

    return jwk.data as JwkType;
};

export const verifyToken = async (token?: string) => {
    if (!token) {
        return false
    }

    const decodedToken = jwt.decode(token, { complete: true });

    if (!decodedToken) {
        return false
    }

    const { header: { kid } } = decodedToken;  // {"kid":"XYZAAAAAAAAAAAAAAA/1A2B3CZ5x6y7MA56Cy+6abc=", "alg": "RS256"}

    if (!kid) {
        return false;
    }

    const jsonWebKeys = await getJwk();

    const jsonWebKey = jsonWebKeys.keys.find(key => key.kid === kid);

    if (!jsonWebKey) {
        return false;
    }

    return await new Promise(async (resolve, _) => {

        const pem = jwkToPem(jsonWebKey);

        jwt.verify(token, pem, { algorithms: ['RS256'] }, (err: any, _: any) => {
            if (err) {
                resolve(false);
            } else {
                // console.log(decodedToken);
                resolve(true);
            }
        });

    }) as boolean;
};

export const bearerAuthenticationMiddleware: AsyncLambdaMiddlewareWithServices<APIGatewayProxyEvent> = async (event, context, callback, services, next) => {

    const { validateRequests, authorization, openApiDocument: { security }, openApiDefinition } = services!;

    if (validateRequests) {
        const bearerAuth = security || openApiDefinition?.schema?.security;

        if (bearerAuth?.some((item: any) => Object.entries(item).some(([key, _]) => key === 'bearerAuth'))) {

            const [, bearerToken] = authorization?.split(' ') || [];

            const verified = await verifyToken(bearerToken);

            if (!verified) {
                throw new Error('Authorization is not verified');
            }
        }
    }

    return await next!(event, context, callback);
};
