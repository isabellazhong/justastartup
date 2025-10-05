import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import companyRouter from './routers/company';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/company', companyRouter);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Justastartup API is running!' });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;