const express = require("express");
const verifyToken = require("../utils/verifyUser");
const NoteController = require("../controller/NoteController");

const router = express.Router();
router.post("/add", verifyToken, NoteController.addNote);
router.post("/edit/:noteId", verifyToken, NoteController.editNote);
router.get("/all", verifyToken, NoteController.getAllNotes);
router.delete("/delete/:noteId", verifyToken, NoteController.deleteNote);
router.put(
  "/update-Note-Pinned/:noteId",
  verifyToken,
  NoteController.updateNotePinned
);
router.get("/search", verifyToken, NoteController.searchNote);

module.exports = router;
