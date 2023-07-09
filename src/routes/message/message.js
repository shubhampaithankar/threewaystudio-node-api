const express = require('express');
const router = express.Router();

const Message = require('../../models/message');

router.get('/list', async (req, res) => {
  try {
    const userId = req.user.userId;

    const messages = await Message.find({
      $or: [{ manufacturer: userId }, { transporter: userId }],
    }).sort({ createdAt: -1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

router.post('/create', async (req, res) => {
    try {
      const { orderID, from, to, quantity, pickupAddress, transporter } = req.body;
      const manufacturer = req.user.userId; 
  
      const message = new Message({
        orderID,
        from,
        to,
        quantity,
        pickupAddress,
        manufacturer,
        transporter,
      });
  
      await message.save();
  
      res.status(201).json({ message: 'Message created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
})

router.put('/update/:id', async (req, res) => {
  try {
    const messageId = req.params.id;
    const { orderID, from, to, quantity, pickupAddress, transporter } = req.body;
    const manufacturer = req.user.userId;

    const updatedMessage = await Message.findOneAndUpdate(
      { _id: messageId, manufacturer: manufacturer },
      { orderID, from, to, quantity, pickupAddress, transporter },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.status(200).json({ message: 'Message updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

module.exports = router
