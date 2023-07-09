const express = require('express');
const router = express.Router();
const User = require('../../../models/user');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
    try {
        const { email, password, role } = req.body;
    
        const user = await User.findOne({ email, role });
        if (!user) {
          return res.status(400).json({ error: 'No user found' });
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(400).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET_KEY, {
          expiresIn: '6h',
        });
    
        res.status(200).json({ token, user: { id: user.id, name: user.name, role: user.role, email: user.email, address: user.address } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = router;