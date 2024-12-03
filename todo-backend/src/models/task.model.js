import { DataTypes } from 'sequelize';
import sequelize from '../../db.js';
import User from './user.model.js';
import Group from './group.model.js';

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    deadline: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('à faire', 'en cours', 'complétée', 'abandonnée'),
        defaultValue: 'à faire'
    },
    assignedUser: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: User,
            key: 'id'
        }
    },
    groupId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Group,
            key: 'id'
        }
    }
}, {
    getterMethods: {
        isOverdue() {
            return this.deadline && new Date(this.deadline) < new Date();
        }
    }
});

Task.associate = (models) => {
    //Task.belongsTo(models.User, { foreignKey: 'assignedUserId', as: 'assignedUser' });
    //Task.belongsTo(models.Group, { foreignKey: 'groupId', as: 'group'});
      Task.belongsTo(models.User, {
          as: 'assignedTo',
          foreignKey: 'assignedUser'});
      Task.belongsTo(models.Group, {
          foreignKey: 'groupId',
          allowNull: true // null signifie que c'est une todo privée
      });
  };
export default Task;
