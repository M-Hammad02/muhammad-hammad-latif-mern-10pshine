const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Folder = require("../models/Folder");
const Note = require("../models/Note"); // ✅ import Note model

// ✅ Get all folders for current user
router.get("/", auth, async (req, res) => {
  try {
    const folders = await Folder.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "ASC"]],
    });
    res.json(folders);
  } catch (err) {
    console.error("Error fetching folders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Create new folder
router.post("/", auth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Folder name is required" });
    }

    const userId = req.user?.id;
    if (!userId) {
      console.error("❌ Missing req.user in folder creation");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const folder = await Folder.create({ name, userId });
    console.log("✅ Folder created:", folder.toJSON());
    res.status(201).json(folder);
  } catch (err) {
    console.error("❌ Folder creation failed:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Delete folder (and its notes)
router.delete("/:id", auth, async (req, res) => {
  try {
    const folder = await Folder.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    // 🧠 Delete all notes inside this folder
    await Note.destroy({ where: { folderId: folder.id } });

    // 🗑️ Delete folder
    await folder.destroy();

    res.json({ message: `Folder '${folder.name}' and its notes deleted successfully` });
  } catch (err) {
    console.error("Error deleting folder:", err);
    res.status(500).json({ message: "Server error while deleting folder" });
  }
});

module.exports = router;
