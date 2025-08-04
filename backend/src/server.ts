//This is the address of the server http://localhost:3000
// URL to access the server: http://localhost:3000
//IP address of the server: 127.0.0.1:3000 
require('dotenv').config(); // Load environment variables from .env file
import express from 'express';
import config from 'config'; // Import configuration settings
import connectToDatabase from './utils/ConnectToDb'; // Import the database connection utility
import router from './routes/index'; // Import the router for handling routes
import cors from 'cors'; // Import CORS middleware for handling cross-origin requests
import authRoutes from './routes/authRoutes'; // Import authentication routes
import BodyParser from 'body-parser'; // Import body-parser middleware for parsing request bodies
import CookieParser from 'cookie-parser'; // Import cookie-parser middleware for handling cookies
import compression from 'compression'; // Import compression middleware for response compression
import rootRouter from './routes/index';
import { PrismaClient } from '@prisma/client'; // Import Prisma client for database operations
import { errorMiddleware } from './middleware/errorsMiddleware';
import { SignUpSchema } from './schema/user';
import UserRoutes from './routes/User';
import ProjectRoutes from './routes/Project';
import EmployeeRoutes from './routes/Employee';
import http from 'http'; // Import HTTP module for creating the server
import {Server,Socket} from 'socket.io'; // Import Socket.IO for real-time communication

const app = express();
const server = http.createServer(app);
app.use(cors({
  origin: 'http://localhost:5173', // ✅ Your frontend origin
  credentials: true,               // ✅ Allow cookies/auth headers
}));
// Initialize Socket.IO with the server
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  },
});

io.on('connection', (socket: Socket) => {
  console.log('🟢 Admin connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔴 Admin disconnected:', socket.id);
  });
});

export { io };



app.use(compression()); // Use compression middleware to compress responses
app.use(BodyParser.json()); // Use body-parser to parse JSON request bodies
app.use(CookieParser()); // Use cookie-parser to handle cookies
app.use(express.json());
app.use(router); // Use the router for handling routes
const PORT = process.env.PORT || 3000;



app.use('/api', rootRouter); // Use authentication routes under the /auth path
app.use('/api/user', UserRoutes); // Use user-specific routes under the /user path')
app.use('/api/projects', ProjectRoutes); // Use project-specific routes under the /projects path
app.use('/api/employees', EmployeeRoutes);

export const prisma = new PrismaClient(
  {
    log: ['query', 'info', 'warn', 'error'], // Enable logging for debugging purposes
  }
);

app.use(errorMiddleware)

//HTTP VERDS && Routes
//The methods used in the routes are GET, POST, PUT, DELETE
{/* app.get('/', (req, res) => {
    //This is endpoint1 for the root URL
  res.send('SmartPulse Server is running!');
});

//This is endpoint2 for the root URL
{/*app.get('/auth', (req, res) => {
    console.log('Authentication endpoint hit');
  // Here you can add authentication logic
  res.send({ message: 'Welcome to the SmartPulse API!' });
});*/}  


//CRUD-methods - //Create-post, Read-get, Update-put, Delete-delete operations can be implemented here


//Website endpoint

//api endpoint

// Dummy connectToDb function for demonstration; replace with actual implementation or import as needed

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectToDatabase();
});
