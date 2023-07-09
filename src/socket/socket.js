const Message = require('../models/message')
const { verifyToken } = require('../middleware/auth')
const { Socket } = require('socket.io');
const message = require('../models/message');

/**
 * 
 * @param {Socket} socket 
 * @returns 
 */
const handleSocketEvents = async (socket) => {
  // console.log(`User Connected ${socket.id}`)
  const token = socket.handshake.headers.authorization;
  if (token) {
    const decoded = verifyToken(token.split(' ')[1])
    if (!decoded) return socket.disconnect()

    const { userId, role } = decoded

    console.log(`User Connected ${role} - ${socket.id} - ${userId}`)
    socket.join(userId)

    // Send list of messages to the user upon connection
    socket.emit('messages', await fetchAllMessages(userId))

    socket.rooms.forEach(e => console.log(e))

    // Handle messages from a user
    socket.on('createMessage', async (body) => {
      try {

        const message = new Message(body)
        await message.save()

        console.log(`new message created for ${body.transporter}`)

        await socket.emit('messages', await fetchAllMessages(userId))
        await socket.to(body.transporter).emit('messages', await fetchAllMessages(userId))

      } catch(error) {
        console.error(error)
      }
    })

    socket.on('replyMessage', async ( body) => {
      try {
        const { orderID, price } = body
        const message = await Message.findOne({ orderID })

        if (message) {
          message.price = price
          await message.save()
          console.log(`message updated for ${message.manufacturer}`)

          await socket.emit('messages', await fetchAllMessages(userId))
          await socket.to(message.manufacturer).emit('messages', await fetchAllMessages(userId))
        }

      } catch (error) {
        console.error(error);
      }
    })
  }
}

const fetchAllMessages = (userId) => {
  try {
    return Message.find({ $or: [{ manufacturer: userId }, { transporter: userId }] })
    .sort({ createdAt: -1 })
  } catch (e) {
    console.log(e)
  }
}

module.exports = handleSocketEvents
