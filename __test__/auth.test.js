const request = require("supertest");
const app = require("../app");
const { sequelize, User } = require("../models");

afterAll(() => {
  User.destroy({ truncate: true, cascade: true })
    .then(() => {
      sequelize.close();
    })
    .catch((err) => {
      console.log(err);
    });
});

describe("EndPoint /register", () => {
  it("Should be able to register", async () => {
    const response = await request(app)
      .post("/register")
      .set("Content-Type", "application/json")
      .send({ email: "testreg@mail.com", password: "rahasia" });

    expect(response.statusCode).toBe(201);
    expect(response.body.email).toBe("testreg@mail.com");
  });
});
