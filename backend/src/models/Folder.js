const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("./index");

class Folder extends Model {}

Folder.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
  },
  { sequelize, modelName: 'Folder', tableName: 'folders', timestamps: true }
);

module.exports = Folder;
