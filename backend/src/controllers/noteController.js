const Note = require('../models/Note');
exports.createNote = async (req, res) => {
const { title, content } = req.body;
const note = await Note.create({ title, content, userId: req.user.id });
res.status(201).json(note);
};
exports.getNotes = async (req, res) => {
const { search } = req.query;
const where = { userId: req.user.id };
if (search) {
where.title = { [require('sequelize').Op.like]: `%${search}%` };
}
const notes = await Note.findAll({ where, order: [['updatedAt', 'DESC']] });
res.json(notes);
};
exports.getNote = async (req, res) => {
const note = await Note.findOne({ where: { id: req.params.id, userId:
req.user.id } });
if (!note) return res.status(404).json({ message: 'Note not found' });
res.json(note);
};
exports.updateNote = async (req, res) => {
const note = await Note.findOne({ where: { id: req.params.id, userId:
req.user.id } });
if (!note) return res.status(404).json({ message: 'Note not found' });
const { title, content } = req.body;
await note.update({ title, content });
res.json(note);
};
exports.deleteNote = async (req, res) => {
const note = await Note.findOne({ where: { id: req.params.id, userId:
req.user.id } });
if (!note) return res.status(404).json({ message: 'Note not found' });
await note.destroy();
res.json({ message: 'Deleted' });
};