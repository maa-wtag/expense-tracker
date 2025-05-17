import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import passport from './config/passport.js';
import authRoutes from "./routes/authRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.get("/", (req, res) => {
  res.json({ message: "Expense Tracker API is running 🚀" });
});

app.use(notFound);
app.use(errorHandler);

export default app;
