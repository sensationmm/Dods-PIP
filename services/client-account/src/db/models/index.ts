import ClientAccountModel from './ClientAccount';
import SubscriptionTypeModel from './SubscriptionType';

ClientAccountModel.belongsTo(SubscriptionTypeModel, {
    foreignKey: 'subscription',
});

export { ClientAccountModel, SubscriptionTypeModel };
