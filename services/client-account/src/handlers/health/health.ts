import { HttpSuccessResponse } from '../../domain';

export const health = async ({test}: any) => {
    console.log('test :', test)
    return new HttpSuccessResponse('healthy');
};