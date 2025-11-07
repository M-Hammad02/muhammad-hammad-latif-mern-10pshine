const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('./index');

class User extends Model {}
User.init(
{
id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
name: { type: DataTypes.STRING, allowNull: false },
email: { type: DataTypes.STRING, allowNull: false, unique: true },
password: { type: DataTypes.STRING, allowNull: false },
avatar: { type: DataTypes.STRING, allowNull: true }, 
bio: { type: DataTypes.TEXT, allowNull: true },  
reset_token: { type: DataTypes.STRING },
reset_expires: { type: DataTypes.DATE },  
},
{ sequelize, modelName: 'User', tableName: 'users', timestamps: true }
);

module.exports = User;
