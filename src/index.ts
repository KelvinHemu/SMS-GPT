import app from './app';
import { env } from './config/env';
import { connectDB } from './config/database';

// Connect to MongoDB
connectDB().catch(console.error);

// Start server
const server = app.listen(env.port, () => {
  console.log(`SMS GPT server listening on port ${env.port} in ${env.nodeEnv} mode`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});