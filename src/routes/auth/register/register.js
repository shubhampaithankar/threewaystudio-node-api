const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')

const User = require('../../../models/user');

router.post('/', async (req, res) => {
    try {
        const { name, email, password, role, address } = req.body;
    
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ error: 'Email is already registered' });
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const user = new User({ name, email, password: hashedPassword, role, address });
        await user.save();
    
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = router;