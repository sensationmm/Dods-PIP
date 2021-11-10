import { ClientAccount } from '.';
let clientAccountWhere: any = {};
clientAccountWhere['$subscriptionType.uuid$'] =
    'b4ba9b77-7dce-43a6-853d-efd9c5dcd48a';

ClientAccount.findAndCountAll({
    where: clientAccountWhere,
    include: ['subscriptionType', 'team'],
    //limit: 10,
}).then(console.log);
