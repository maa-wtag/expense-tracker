import express from "express";
import passport from "../config/passport.js";
import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
  getMonthlySpending,
} from "../controllers/expenseController.js";
const router = express.Router();

// Protect all expense routes with Passport JWT
const auth = passport.authenticate("jwt", { session: false });
router.route("/").post(auth, createExpense).get(auth, getExpenses);
router.route("/:id").put(auth, updateExpense).delete(auth, deleteExpense);
router.get("/summary", auth, getExpenseSummary);
router.get("/monthly", auth, getMonthlySpending);

export default router;
