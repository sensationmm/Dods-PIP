import { HttpSuccessResponse } from '../../domain/http';

export const userByName = async () => {    
    // handle user requests 
    return new HttpSuccessResponse('userByName');
};