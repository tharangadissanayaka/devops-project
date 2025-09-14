// ...existing code...
const express = require('express');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://dtharanga023_db_user:2fcV3CrAa3qvpZac@cluster0.xfcmp4d.mongodb.net/taskmaster?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// Basic API route
app.get('/', (req, res) => {
  res.send('TaskMaster backend is running');
});

// Auth and Task routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
// Register new feature routes
app.use('/api/comments', require('./routes/comments'));
app.use('/api/activity', require('./routes/activity'));
app.use('/api/attachments', require('./routes/attachments'));


// Socket.IO setup
io.on('connection', (socket) => {
  console.log('A user connected');

  // Broadcast new task to all clients
  socket.on('task:add', (task) => {
    socket.broadcast.emit('task:add', task);
  });

  // Broadcast task update to all clients
  socket.on('task:update', ({ id, status }) => {
    socket.broadcast.emit('task:update', { id, status });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
