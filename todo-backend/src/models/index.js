import User from './user.model.js';
import Group from './group.model.js';
import GroupMember from './groupMember.model.js';

// Définir les associations
Group.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
Group.hasMany(GroupMember, { foreignKey: 'groupId' });
Group.belongsToMany(User, { through: GroupMember, foreignKey: 'groupId', as: 'members' });

GroupMember.belongsTo(Group, { foreignKey: 'groupId' });
GroupMember.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Group, { foreignKey: 'createdBy' });
User.belongsToMany(Group, { through: GroupMember, foreignKey: 'userId', as: 'memberOf' });

export { User, Group, GroupMember }; 