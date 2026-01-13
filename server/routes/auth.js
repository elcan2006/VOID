const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const axios = require('axios');

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log('Register request:', { username, email });

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'USER_EXISTS' });

        user = new User({ username, email, password });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, username: user.username });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login request:', { email });
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'INVALID_CREDENTIALS' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'INVALID_CREDENTIALS' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, username: user.username });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: err.message });
    }
});

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google Login
router.post('/google', async (req, res) => {
    try {
        const { accessToken } = req.body;
        console.log('Google login request received');

        // Fetch user info from Google using the access token
        const googleRes = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
        const { name, email } = googleRes.data;

        if (!email) return res.status(400).json({ message: 'EMAIL_REQUIRED' });

        let user = await User.findOne({ email });
        if (!user) {
            user = new User({
                username: name || email.split('@')[0],
                email,
                password: Math.random().toString(36).slice(-10)
            });
            await user.save();
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, username: user.username });
    } catch (err) {
        console.error('Google Auth Error:', err.response?.data || err.message);
        res.status(500).json({ message: 'Google authentication failed' });
    }
});

module.exports = router;
