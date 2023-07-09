const express = require('express');
const router = express.Router();

const User = require('../models/user')
const { authenticateToken } = require('../middleware/auth');

const authRoute = require('./auth/auth')
const messageRoute = require('./message/message');

router.use('/auth', authRoute)
router.use('/message', authenticateToken, messageRoute)

router.get('/transporters', authenticateToken, async (req, res) => {
    try {
        const transporters = await User.find({ role: 'transporter' });
        res.status(200).json({transporters: [...transporters]});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = router