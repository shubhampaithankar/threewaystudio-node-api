const dotenv = require('dotenv')
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose')

const handleSocketEvents = require('./src/socket/socket');
const routes = require('./src/routes/routes')

const app = express();

app.use(express.json());
app.use(cors());

app.use('/', routes)

dotenv.config()

const server = http.createServer(app);
const io = new socketIO.Server(server, {
  cors: {
    origin: 'https://localhost:3000',
    methods: ['GET', 'POST', 'PUT']
  }
})

io.on('connection', handleSocketEvents)

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(mongo => {
  console.log(`Connected to MongoDB ${mongo.connection.name}`)
})

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server started on port http://localhost:${PORT}`);
});
