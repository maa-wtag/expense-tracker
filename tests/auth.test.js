import request from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "../src/app.js";
import User from "../src/models/User.js";

dotenv.config();

describe("Auth API", () => {
  beforeAll(async () => {
    await mongoose.connect(
      process.env.MONGO_URI_TEST || process.env.MONGO_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should register a new user and return a token", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      })
      .expect("Content-Type", /json/)
      .expect(201);

    expect(res.body).toHaveProperty("token");
    expect(res.body.email).toBe("test@example.com");
  });

  it("should not allow duplicate registration", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      })
      .expect(400);
  });

  it("should login existing user and return token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "password123" })
      .expect("Content-Type", /json/)
      .expect(200);

    expect(res.body).toHaveProperty("token");
    expect(res.body.email).toBe("test@example.com");
  });

  it("should reject invalid login", async () => {
    await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "wrongpass" })
      .expect(401);
  });
});
