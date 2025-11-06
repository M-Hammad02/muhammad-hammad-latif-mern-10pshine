const Note = require('../models/Note');
// Create new note
exports.createNote = async (req, res) => {
  try {
    const { title, content, folderId } = req.body;
    const note = await Note.create({
      title,
      content,
      folderId: folderId || null,
      userId: req.user.id,
    });
    res.status(201).json(note);
  } catch (err) {
    console.error("Error creating note:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all notes for user
exports.getNotes = async (req, res) => {
const { search } = req.query;
const where = { userId: req.user.id };
if (search) {
where.title = { [require('sequelize').Op.like]: `%${search}%` };
}
const notes = await Note.findAll({ where, order: [['updatedAt', 'DESC']] });
res.json(notes);
};

// Get single note
exports.getNote = async (req, res) => {
const note = await Note.findOne({ where: { id: req.params.id, userId:
req.user.id } });
if (!note) return res.status(404).json({ message: 'Note not found' });
res.json(note);
};

// Update note
exports.updateNote = async (req, res) => {
const note = await Note.findOne({ where: { id: req.params.id, userId:
req.user.id } });
if (!note) return res.status(404).json({ message: 'Note not found' });
const { title, content } = req.body;
await note.update({ title, content });
res.json(note);
};

// Delete note
exports.deleteNote = async (req, res) => {
const note = await Note.findOne({ where: { id: req.params.id, userId:
req.user.id } });
if (!note) return res.status(404).json({ message: 'Note not found' });
await note.destroy();
res.json({ message: 'Deleted' });
};