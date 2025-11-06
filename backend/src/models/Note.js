const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('./index');

class Note extends Model {}

Note.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT('long'), allowNull: false },
    folderId: {
      type: DataTypes.INTEGER,
      allowNull: true, // ✅ allows “No Folder”
      references: {
        model: 'folders',
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  { sequelize, modelName: 'Note', tableName: 'notes', timestamps: true }
);

module.exports = Note;

