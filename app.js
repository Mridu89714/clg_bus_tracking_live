const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = 3000;

let busLocations = {}; 

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index'); 
});

app.get('/login', (req, res) => {
  res.render('login'); 
});

app.post('/dashboard', (req, res) => {
  const busNumber = req.body.busNumber;
  res.render('dashboard', { busNumber });
});

// New route for student_dashboard
app.get('/studentdashboard', (req, res) => {
  res.render('student_dashboard');
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('locationUpdate', (data) => {
    busLocations[data.busNumber] = { lat: data.lat, lon: data.lon };
    io.emit('updateMap', busLocations); 
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
