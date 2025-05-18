import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { applySecurity } from "./config/security.js";

const app = express();
applySecurity(app);
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.get("/", (req, res) => {
  res.json({ message: "Expense Tracker API is running 🚀" });
});

app.use(notFound);
app.use(errorHandler);

export default app;
