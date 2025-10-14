const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('./index');
const User = require('./User');
class Note extends Model {}
Note.init(
{
id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
title: { type: DataTypes.STRING, allowNull: false },
content: { type: DataTypes.TEXT('long'), allowNull: false },
// optionally add tags, isPinned, etc
},
{ sequelize, modelName: 'Note', tableName: 'notes', timestamps: true }
);
Note.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Note, { foreignKey: 'userId' });
module.exports = Note;
