import {
    AsyncLambdaMiddleware,
    HttpResponse,
    HttpStatusCode,
} from '@dodsgroup/dods-lambda';

import { ClientAccountRepository } from '../../repositories';

interface CheckNameAvailabilityParameters {
    name: string;
}
export const checkClientAccountName: AsyncLambdaMiddleware<CheckNameAvailabilityParameters> =
    async ({ name }) => {
        const isNameAvailable =
            await ClientAccountRepository.defaultInstance.checkNameAvailability(
                name
            );

        return new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: isNameAvailable
                ? 'Name is available.'
                : 'Name is not available.',
            data: {
                isNameAvailable,
            },
        });
    };
