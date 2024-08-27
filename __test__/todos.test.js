const request = require("supertest");
const app = require("../app");
const { Todo, User, sequelize } = require("../models");

let token;
let todos;

beforeAll(async () => {
  try {
    // create user & get token
    const user = await User.create({
      email: "testtodo@mail.com",
      password: "rahasiajuga",
    });

    token = user.generateToken();

    todos = await Todo.bulkCreate([
      { task: "Belajar nodejs", UserId: user.id },
      { task: "Belajar react", UserId: user.id },
    ]);
  } catch (error) {
    console.log(error);
  }
});

afterAll(async () => {
  await Todo.destroy({ truncate: true });
  await User.destroy({ truncate: true, cascade: true });
  await sequelize.close();
});

describe("EndPoint /todos", () => {
  it("Should not be able to get all todos when token is not provided", async () => {
    const response = await request(app)
      .get("/todos")
      .set("Content-Type", "application/json");

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("Unauthenticated");
  });

  it("Should be able to get all todos", async () => {
    const response = await request(app)
      .get("/todos")
      .set("Content-Type", "application/json")
      .auth(token, { type: "bearer" });

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  it("Should be able to get single todo by id", async () => {
    const response = await request(app)
      .get(`/todos/${todos[0].id}`)
      .set("Content-Type", "application/json")
      .auth(token, { type: "bearer" });

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBeDefined();
    expect(response.body.task).toBeDefined();
    expect(response.body.UserId).toBeDefined();
    expect(response.body.createdAt).toBeDefined();
    expect(response.body.updatedAt).toBeDefined();
  });
});