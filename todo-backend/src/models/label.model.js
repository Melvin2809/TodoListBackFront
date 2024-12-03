import { DataTypes } from 'sequelize';
import sequelize from '../../db.js';
import Task from './task.model.js';

const Label = sequelize.define('Label', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    label: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    color: {
        type: DataTypes.STRING,
        defaultValue: '#000000',
        validate: {
            isHexColor: true
        }
    },
    taskId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Task,
            key: 'id'
        }
    }
});

// Définition des relations
Task.hasMany(Label, { foreignKey: 'taskId' });
Label.belongsTo(Task, { foreignKey: 'taskId' });

export default Label; 