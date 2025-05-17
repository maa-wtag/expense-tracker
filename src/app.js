import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  standardHeaders: true, // return rate limit info in the RateLimit-* headers
  legacyHeaders: false, // disable the X-RateLimit-* headers
});
app.use(limiter);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.get('/', (req, res) => {
  res.json({ message: 'Expense Tracker API is running 🚀' });
});

app.use(notFound);
app.use(errorHandler);

export default app;
