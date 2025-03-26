const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

console.log('Loading server dependencies...');

// Routes
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const cartRoutes = require('./routes/cartRoutes');
const promoRoutes = require('./routes/promoRoutes');
const blogRoutes = require('./routes/blogRoutes');

console.log('Routes imported successfully');

// Load environment variables
dotenv.config();
console.log('Environment variables loaded');

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Clothing E-commerce API',
      version: '1.0.0',
      description: 'A Clothing E-commerce REST API',
      contact: {
        name: 'Erfan Ahmadvand',
        phone: '+989109924707',
      },
      license: {
        name: 'Licensed to Erfan Ahmadvand',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
console.log('Swagger documentation generated');

// Create Express app
const app = express();
console.log('Express app created');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());
console.log('Middleware configured');

// Swagger documentation route
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
console.log('Swagger UI route configured at /api-docs');

// Set static folder
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
console.log('Static folder for uploads configured');

// Connect to MongoDB
console.log('Attempting to connect to MongoDB...');
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((err) => console.log('MongoDB Connection Error:', err));

// API Routes
console.log('Setting up API routes...');
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/promos', promoRoutes);
app.use('/api/blog', blogRoutes);
console.log('API routes configured');

// Error handling middleware
app.use((err, req, res, next) => {
  console.log('Error encountered:', err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : null,
  });
});
console.log('Error handling middleware configured');

// Start server
const PORT = process.env.PORT || 5000;
const server = require('http').createServer(app);
const io = require('socket.io')(server);

console.log('Socket.io server initialized');

io.on('connection', (socket) => {
  console.log('New client connected with ID:', socket.id);
  
  socket.on('join_room', (roomId) => {
    console.log(`Client ${socket.id} joined room: ${roomId}`);
    socket.join(roomId);
  });
  
  socket.on('send_message', (data) => {
    console.log(`Message received in room ${data.roomId}: ${data.message}`);
    io.to(data.roomId).emit('receive_message', data);
  });
  
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});
console.log('Socket event handlers configured');

// Start the server with error handling for port in use
server.listen(PORT, () => {
  console.log('==================================');
  console.log(`Server running on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
  console.log('==================================');
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    // If port is in use, try using port + 1
    const newPort = PORT + 1;
    console.log(`Port ${PORT} is in use, trying port ${newPort}...`);
    server.listen(newPort, () => {
      console.log('==================================');
      console.log(`Server running on port ${newPort}`);
      console.log(`API Documentation available at http://localhost:${newPort}/api-docs`);
      console.log('==================================');
    });
  } else {
    console.error('Server error:', err);
  }
});

module.exports = app; 