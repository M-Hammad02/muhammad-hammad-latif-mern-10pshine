require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pino = require('pino');
const path = require("path");
const pinoHttp = require('pino-http');
const bodyParser = require('body-parser');
//const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/notes');
<<<<<<< HEAD
//const userRoutes = require('./routes/user');
=======
const userRoutes = require('./routes/user');
const folderRoutes = require("./routes/folders");
>>>>>>> feature/backend/structure
const errorHandler = require('./middlewares/errorHandler');
const logger = pino({ level: process.env.NODE_ENV === 'production' ? 'info' :
'debug' });
const app = express();
//app.use(cors());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(pinoHttp({ logger }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// routes
//app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
<<<<<<< HEAD
//app.use('/api/users', userRoutes);
=======
app.use('/api/users', userRoutes);
app.use("/api/folders", folderRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
>>>>>>> feature/backend/structure
app.get('/', (req, res) => {
  res.send('✅ Server is running fine');
});

// health
app.get('/health', (req, res) => res.json({ ok: true }));

// error handler (should be last)
app.use(errorHandler);
module.exports = { app, logger };
console.log("✅ app.js fully loaded");
