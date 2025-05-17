import asyncHandler from 'express-async-handler';
import Expense from '../models/Expense.js';

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private
const createExpense = asyncHandler(async (req, res) => {
  const { description, amount, category, date } = req.body;
  const expense = await Expense.create({
    user: req.user._id,
    description,
    amount,
    category,
    date,
  });
  res.status(201).json(expense);
});

// @desc    Get all expenses for user
// @route   GET /api/expenses
// @access  Private
const getExpenses = asyncHandler(async (req, res) => {
  const { category, startDate, endDate, page = 1, limit = 10 } = req.query;
  const filter = { user: req.user._id };
  if (category) filter.category = category;
  if (startDate || endDate) filter.date = {};
  if (startDate) filter.date.$gte = new Date(startDate);
  if (endDate) filter.date.$lte = new Date(endDate);

  const expenses = await Expense.find(filter)
    .sort({ date: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));
  res.json(expenses);
});

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }
  if (expense.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }
  const { description, amount, category, date } = req.body;
  expense.description = description || expense.description;
  expense.amount = amount || expense.amount;
  expense.category = category || expense.category;
  expense.date = date || expense.date;
  const updated = await expense.save();
  res.json(updated);
});

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }
  if (expense.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }
  await expense.deleteOne();
  res.json({ message: 'Expense removed' });
});

// @desc    Get total spending summary
// @route   GET /api/expenses/summary
// @access  Private
export const getExpenseSummary = asyncHandler(async (req, res) => {
  // for admins: no filter; otherwise only their own
  const match = req.user.role === 'admin' ? {} : { user: req.user._id };

  const [result] = await Expense.aggregate([
    { $match: match },
    { $group: { _id: null, totalSpending: { $sum: '$amount' } } },
  ]);

  res.json({
    totalSpending: result ? result.totalSpending : 0,
  });
});

// @desc    Get total spending grouped by month
// @route   GET /api/expenses/monthly
// @access  Private
export const getMonthlySpending = asyncHandler(async (req, res) => {
  // Admins see everyone’s; users see only their own
  const match = req.user.role === 'admin' ? {} : { user: req.user._id };

  const results = await Expense.aggregate([
    { $match: match },
    {
      // group by year/month
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
        },
        total: { $sum: '$amount' },
      },
    },
    {
      // reshape for output
      $project: {
        _id: 0,
        year: '$_id.year',
        month: '$_id.month',
        total: 1,
      },
    },
    { $sort: { year: 1, month: 1 } },
  ]);

  res.json(results);
});

export { createExpense, getExpenses, updateExpense, deleteExpense };
