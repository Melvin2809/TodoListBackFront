import Group from './group.model.js';
import GroupMember from './groupMember.model.js';
import User from './user.model.js';

// Définir toutes les associations ici
const setupAssociations = () => {
    // Associations Group-GroupMember
    Group.hasMany(GroupMember);
    GroupMember.belongsTo(Group);

    // Associations User-GroupMember
    User.hasMany(GroupMember);
    GroupMember.belongsTo(User);
};

export default setupAssociations; 