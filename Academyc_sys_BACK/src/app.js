const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const env = require('./config/env');
const dependencies = require('./config/dependencies');
const buildRoutes = require('./presentation/routes');
const notFoundMiddleware = require('./presentation/middlewares/notFound.middleware');
const errorMiddleware = require('./presentation/middlewares/error.middleware');

const app = express();
const corsOrigin = env.cors.origin === '*' ? '*' : env.cors.origin.split(',').map((origin) => origin.trim());

app.use(helmet());
app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API academica operativa', timestamp: new Date().toISOString() });
});

app.use('/api', buildRoutes(dependencies));
app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;