import express from 'express';
import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
  getMonthlySpending,
} from '../controllers/expenseController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();
router.route('/').post(protect, createExpense).get(protect, getExpenses);
router.route('/:id').put(protect, updateExpense).delete(protect, deleteExpense);
router.route('/summary').get(protect, getExpenseSummary);
router.route('/monthly').get(protect, getMonthlySpending);

export default router;
