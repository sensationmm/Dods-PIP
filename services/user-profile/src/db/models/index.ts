import RoleTypeModel from './RoleType';
import UserProfileModel from './UserProfile';

UserProfileModel.belongsTo(RoleTypeModel, {
    foreignKey: 'role_id',
    as: 'role',
});

export { RoleTypeModel, UserProfileModel };
