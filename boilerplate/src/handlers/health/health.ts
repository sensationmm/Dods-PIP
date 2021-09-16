import { HttpSuccessResponse } from '../../domain';

export const health = async () => {

    return new HttpSuccessResponse('healthy');
};