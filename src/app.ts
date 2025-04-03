import express from 'express';
import bodyParser from 'body-parser';
import smsController from './controllers/sms.controller';
import { errorHandler } from './middleware/error.middleware';

const app: express.Application = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.post('/sms', smsController.handleIncomingMessage);

// Simple health check endpoint
app.get('/', (req, res) => {
  res.send('SMS GPT Service is running');
});

// Error handling middleware (should be after all routes)
app.use(errorHandler);

export default app;