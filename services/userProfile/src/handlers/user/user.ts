import { HttpSuccessResponse } from '../../domain/http';

export const user = async () => {    
    // handle user requests 
    return new HttpSuccessResponse('user');
};