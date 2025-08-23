const request = require("supertest");
const app = require("../app"); // Express app

describe("Auth routes", () => {
  test("POST /api/auth/register returns 201", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "test@example.com", password: "password123" });
    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe("test@example.com");
  });
});
