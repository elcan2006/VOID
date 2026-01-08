const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const auth = require('../middleware/auth');
const { encrypt, decrypt } = require('../utils/encryption');

// Get all notes for a user
router.get('/', auth, async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.user.id }).sort({ timestamp: -1 });
        // Decrypt title and content for the user
        const decryptedNotes = notes.map(note => ({
            ...note._doc,
            title: decrypt(note.title),
            content: decrypt(note.content)
        }));
        res.json(decryptedNotes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a note
router.post('/', auth, async (req, res) => {
    try {
        const { title, content, date, timestamp } = req.body;
        const newNote = new Note({
            userId: req.user.id,
            title: encrypt(title),
            content: encrypt(content),
            date,
            timestamp
        });
        const savedNote = await newNote.save();
        res.status(201).json({
            ...savedNote._doc,
            title: decrypt(savedNote.title),
            content: decrypt(savedNote.content)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a note
router.delete('/:id', auth, async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: 'Note not found' });

        // Ensure user owns the note
        if (note.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await note.deleteOne();
        res.json({ message: 'Note removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
