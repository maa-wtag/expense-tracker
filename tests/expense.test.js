import request from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "../src/app.js";
import Expense from "../src/models/Expense.js";
import User from "../src/models/User.js";

dotenv.config();

describe("Expense API", () => {
  let token;

  beforeAll(async () => {
    await mongoose.connect(
      process.env.MONGO_URI_TEST || process.env.MONGO_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    await Expense.deleteMany({});
    await User.deleteMany({});

    // register and login
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Exp Tester",
        email: "exp@example.com",
        password: "pass1234",
      });
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "exp@example.com", password: "pass1234" });
    token = res.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should create a new expense", async () => {
    const expenseData = {
      description: "Coffee",
      amount: 4.5,
      category: "Food",
      date: "2025-01-15",
    };
    const res = await request(app)
      .post("/api/expenses")
      .set("Authorization", `Bearer ${token}`)
      .send(expenseData)
      .expect(201);

    expect(res.body).toMatchObject({
      description: "Coffee",
      amount: 4.5,
      category: "Food",
    });
  });

  it("should get list of expenses", async () => {
    const res = await request(app)
      .get("/api/expenses")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should update an expense", async () => {
    const expenses = await request(app)
      .get("/api/expenses")
      .set("Authorization", `Bearer ${token}`);
    const id = expenses.body[0]._id;

    const res = await request(app)
      .put(`/api/expenses/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ description: "Updated Coffee" })
      .expect(200);

    expect(res.body.description).toBe("Updated Coffee");
  });

  it("should delete an expense", async () => {
    const expenses = await request(app)
      .get("/api/expenses")
      .set("Authorization", `Bearer ${token}`);
    const id = expenses.body[0]._id;

    const res = await request(app)
      .delete(`/api/expenses/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body).toEqual({ message: "Expense removed" });
  });
});
