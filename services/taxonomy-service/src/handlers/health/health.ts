import { HttpSuccessResponse } from '../../domain/http';

export const health = async () => {

    
    return new HttpSuccessResponse('healthy');
};