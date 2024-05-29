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
      test("GET:404: should return a 404 message if endpoint is valid but doesn't exist", () => {
        return request(app)
          .get("/api/articles/1000")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Can't find article at provided ID");
          });
      });
    });
    describe("GET/API/ARTICLES", () => {
      test("GET:200: should return with a list of all articles which have the correct properties", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.length).toBeGreaterThanOrEqual(13);
            body.articles.forEach((article) => {
              expect(article).toMatchObject({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(String),
              });
            });
          });
      });
      test("GET:200: should return with a list of all articles, none of which should have a body property", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            body.articles.forEach((article) => {
              expect(article).not.toHaveProperty("body");
            });
          });
      });
      test("GET:200: should return with a list of all articles sorted by date (created_at) in descending order", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toBeSortedBy("created_at", {
              descending: true,
            });
          });
      });
    });
    describe("GET/API/ARTICLES/:ARTICLE_ID/COMMENTS", () => {
      test("GET:200: should return a list of comments for the specified article with the correct properties", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.article_comments.length).toBe(11);
            body.article_comments.forEach((commentList) => {
              expect(commentList).toMatchObject({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                article_id: expect.any(Number),
              });
            });
          });
      });
      test("GET:200: should return a list of comments for the specified article with the correct properties sorted by date in ascending order", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.article_comments).toBeSortedBy("created_at", {
              ascending: true,
            });
          });
      });
      test("GET:400: should return an invalid input message if endpoint is a string", () => {
        return request(app)
          .get("/api/articles/banana/comments")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid endpoint / article ID");
          });
      });
      test("GET:400: should return an invalid input message if endpoint is <= 0", () => {
        return request(app)
          .get("/api/articles/-100/comments")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid endpoint / article ID");
          });
      });
      test("GET:400: should return an invalid input message if endpoint is a decimal", () => {
        return request(app)
          .get("/api/articles/1.12/comments")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid endpoint / article ID");
          });
      });
      test("GET:404: should return a 404 message if endpoint is valid but doesn't exist", () => {
        return request(app)
          .get("/api/articles/12163/comments")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Can't find comments at provided article");
          });
      });
    });
    describe("POST/API/ARTICLES/:ARTICLE_ID/COMMENTS", () => {
      test("POST:201: should add the passed in comment to the database and returna it", () => {
        const body = {
          username: "icellusedkars",
          body: "Yeah this is totally tubular man...",
        };
        return request(app)
        .post("/api/articles/1/comments")
        .send(body)
        .expect(201)
        .then(({ body }) => {
          expect(body.posted_comment).toMatchObject({
            comment_id: expect.any(Number),
            body: "Yeah this is totally tubular man...",
            article_id: 1,
            author: "icellusedkars",
            votes: 0,
            created_at: expect.any(String)
          })
        })
      });
      test("POST:400: should return 400 message if body contains extra keys", () => {
        const body = {
          username: "icellusedkars",
          body: "Yeah this is totally tubular man...",
          age: 15
        };
        return request(app)
        .post("/api/articles/1/comments")
        .send(body)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad Request')
        })
      })
      test("POST:400: should return 400 message if body doesn't contain both username and body key(s)", () => {
        const body = {
          username: "icellusedkars"
        };
        return request(app)
        .post("/api/articles/1/comments")
        .send(body)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad Request')
        })
      })
      test("POST:400: should return a 400 message if username key is not a string", () => {
        const body = {
          username: 19,
          body: "icellusedkars"
        };
        return request(app)
        .post("/api/articles/1/comments")
        .send(body)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad Request')
        })
      })
      test("POST:400: should return a 400 message if body key is not a string", () => {
        const body = {
          username: "icellusedkars",
          body: 12
        };
        return request(app)
        .post("/api/articles/1/comments")
        .send(body)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad Request')
        })
      })
      test("POST:400: should return a 400 message if endpoint is anything other than a number", () => {
        const body = {
          username: "icellusedkars",
          body: "Yeah this is totally tubular man..."
        };
        return request(app)
        .post("/api/articles/banana/comments")
        .send(body)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid endpoint / article ID")
        })
      })
      test("POST:400: should return a 400 message if endpoint is an integer but <=0", () => {
        const body = {
          username: "icellusedkars",
          body: "Yeah this is totally tubular man..."
        };
        return request(app)
        .post("/api/articles/-10/comments")
        .send(body)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid endpoint / article ID")
        })
      })
      test("POST:400: should return a 400 message if endpoint is a decimal", () => {
        const body = {
          username: "icellusedkars",
          body: "Yeah this is totally tubular man..."
        };
        return request(app)
        .post("/api/articles/10.123/comments")
        .send(body)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid endpoint / article ID")
        })
      })
      test("POST:404: should return a 404 message if endpoint is valid but doesn't exist", () => {
        const body = {
          username: "icellusedkars",
          body: "Yeah this is totally tubular man..."
        };
        return request(app)
        .post("/api/articles/506/comments")
        .send(body)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Can't find article at provided ID")
        })
      })
      test("POST:404: should return a 404 message if user is valid but doesn't exist", () => {
        const body = {
          username: "mjj677",
          body: "Yeah this is totally tubular man..."
        };
        return request(app)
        .post("/api/articles/506/comments")
        .send(body)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Can't find article at provided ID")
        })
      })
    });
  });
});
