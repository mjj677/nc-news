const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("app.js", () => {
  describe("TOPICS", () => {
    describe("GET/API/TOPICS", () => {
      test("GET:200: should return with an array of all topic objects with correct properties", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body.ENDPOINTS.length).toBe(3);
            body.ENDPOINTS.forEach((topic) => {
              expect(topic).toMatchObject({
                slug: expect.any(String),
                description: expect.any(String),
              });
            });
          });
      });
    });
    describe("GET/API", () => {
      test("GET:200: should return with an object describing all the available endpoints on your API", () => {
        return request(app)
          .get("/api")
          .expect(200)
          .then(({ body }) => {
            expect(body).toHaveProperty("GET /api");
            expect(body).toHaveProperty("GET /api/topics");
            expect(body).toHaveProperty("GET /api/articles");
          });
      });
    });
  });
});
