const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");
const endpoints = require("../endpoints.json");

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
            expect(body.endpoints).toEqual(endpoints);
          });
      });
    });
    describe("GET/API/ARTICLES/:ARTICLE_ID", () => {
      test("GET:200: should return an article object with the specified ID and correct properties", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            expect(body.article[0]).toMatchObject({
              article_id: 1,
              author: expect.any(String),
              title: expect.any(String),
              body: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
            });
          });
      });
      test("GET:400: should return an invalid input message if endpoint is a string", () => {
        return request(app)
          .get("/api/articles/northcoders")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid endpoint / article ID");
          });
      });
      test("GET:400: should return an invalid input message if endpoint is <= 0", () => {
        return request(app)
          .get("/api/articles/-25")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid endpoint / article ID");
          });
      });
      test("GET:400: should return an invalid input message if endpoint is a decimal", () => {
        return request(app)
          .get("/api/articles/1.5")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid endpoint / article ID");
          });
      });
      test("GET:400: should return a 404 message if endpoint is valid but doesn't exist", () => {
        return request(app)
          .get("/api/articles/1000")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Can't find article at provided ID");
          });
      });
    });
  });
});
