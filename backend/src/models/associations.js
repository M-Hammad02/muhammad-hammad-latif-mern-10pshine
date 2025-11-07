const User = require("./User");
const Folder = require("./Folder");
const Note = require("./Note");

// Define relationships here
User.hasMany(Folder, { foreignKey: "userId", onDelete: "CASCADE" });
Folder.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

Folder.hasMany(Note, { foreignKey: "folderId", onDelete: "SET NULL" });
Note.belongsTo(Folder, { foreignKey: "folderId", onDelete: "SET NULL" });

User.hasMany(Note, { foreignKey: "userId", onDelete: "CASCADE" });
Note.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

module.exports = { User, Folder, Note };
