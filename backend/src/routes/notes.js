const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const noteController = require('../controllers/noteController');
const { createNoteValidation, updateNoteValidation } = require('../validations/noteValidation');
const validate = require('../middlewares/validate');
const verifyToken = require("../middlewares/verifyToken");
const { Note } = require("../models");
//router.use(auth);
router.use(verifyToken);

// Create a new note
router.post('/', auth, createNoteValidation, validate, noteController.createNote);

// Get all notes or a specific note by ID
router.get('/', auth, noteController.getNotes);

// Get, update, delete note by ID
router.get('/:id', auth, noteController.getNote);

// Update note by ID
router.put('/:id', auth, updateNoteValidation, validate, noteController.updateNote);

// Delete note by ID
router.delete('/:id', auth, noteController.deleteNote);

router.patch("/:id/move", verifyToken, async (req, res) => {
  try {
    const Note = require("../models/Note"); // ✅ Import directly to be sure
    const note = await Note.findByPk(req.params.id);

    if (!note) return res.status(404).json({ message: "Note not found" });

    const { folderId } = req.body;
    note.folderId = folderId || null;

    await note.save();

    res.json({ message: "Note moved successfully", note });
  } catch (err) {
    console.error("❌ Move note failed:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
