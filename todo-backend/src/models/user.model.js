import sequelize from "../../db.js"; 
import { DataTypes } from "sequelize"; 

const User = sequelize.define('User', { 
  username: { 
    type: DataTypes.STRING, 
    allowNull: false,
    unique: true 
  }, 
  password: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateOfBirth: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}); 

export default User;