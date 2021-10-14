import { ClientAccountRepository } from '../../repositories';

export const health = async () => {
    const getClientAccount = await ClientAccountRepository.defaultInstance.getClientAccount('uuid');
    return JSON.stringify(getClientAccount);
};
