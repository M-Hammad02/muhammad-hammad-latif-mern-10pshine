require('dotenv').config();
//require('express-async-errors');
const express = require('express');
const cors = require('cors');
const pino = require('pino');
const pinoHttp = require('pino-http');
const bodyParser = require('body-parser');
//const authRoutes = require('./routes/auth');
//const noteRoutes = require('./routes/notes');
const userRoutes = require('./routes/user');
const errorHandler = require('./middlewares/errorHandler');
const logger = pino({ level: process.env.NODE_ENV === 'production' ? 'info' :
'debug' });
const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));
app.use(pinoHttp({ logger }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
// routes
//app.use('/api/auth', authRoutes);
//app.use('/api/notes', noteRoutes);
app.use('/api/users', userRoutes);
app.get('/', (req, res) => {
  res.send('✅ Server is running fine');
});

// health
app.get('/health', (req, res) => res.json({ ok: true }));
// error handler (should be last)
app.use(errorHandler);
module.exports = { app, logger };
console.log("✅ app.js fully loaded");
