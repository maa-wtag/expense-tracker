import express from "express";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
  getMonthlySpending,
} from "../controllers/expenseController.js";

const router = express.Router();

// Any authenticated user can create or list; update/delete restricted in controllers
router
  .route("/")
  .post(protect, createExpense)
  .get(protect, authorizeRoles("user", "admin"), getExpenses);
router
  .route("/:id")
  .put(protect, authorizeRoles("user", "admin"), updateExpense)
  .delete(protect, authorizeRoles("user", "admin"), deleteExpense);
router
  .route("/summary")
  .get(protect, authorizeRoles("user", "admin"), getExpenseSummary);
router
  .route("/monthly")
  .get(protect, authorizeRoles("user", "admin"), getMonthlySpending);

export default router;
