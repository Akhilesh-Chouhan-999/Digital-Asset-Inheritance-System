import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { configDotenv } from 'dotenv';
import { authRoutes, assetRoutes, nomineeRoutes, adminRoutes, inactivityRoutes } from './src/routes/index.js';
import { errorHandler } from './src/middleware/index.js';


const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(morgan('dev'));
app.use(compression());
configDotenv();


app.get('/ping', (req, res) => {
  return res.status(200).json({ message: 'pong' });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/assets', assetRoutes);
app.use('/api/v1/nominees', nomineeRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/inactivity', inactivityRoutes);

// Global Error Handler (must be last)
app.use(errorHandler);

export default app;