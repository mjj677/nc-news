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
            expect(body.Topics.length).toBe(3);
            body.Topics.forEach((topic) => {
              expect(topic).toMatchObject({
                slug: expect.any(String),
                description: expect.any(String),
              });
            });
          });
      });
    });
  });
  describe("API", () => {
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
  });
  describe("ARTICLES", () => {
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
      test("GET:200: should return an article object with the specified ID and a comment_count property", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            expect(body.article[0]).toEqual(
              expect.objectContaining({
                article_id: 1,
                comment_count: "11",
              })
            );
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
    xdescribe("GET/API/ARTICLES", () => {
      test("GET:200: should return with a list of all articles which have the correct properties, when given no topic", () => {
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
      test("GET:200: should return with a list of articles filtered by specified topic when given a valid topic", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.length).toBeGreaterThanOrEqual(12);
          });
      });
      test("GET:200: should return with an empty array when passed a topic that doesn't exist", () => {
        return request(app)
          .get("/api/articles?topic=topicthatnoexist")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toEqual([]);
          });
      });
      test("GET:200: should return a list of articles sorted by a passed in column, when column is valid", () => {
        return request(app)
          .get("/api/articles?sort_by=title")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toBeSortedBy("title", { descending: true });
          });
      });
      test("GET:200: should return a list of articles sorted by sort_by, ordered by order_by and all have the declared topic", () => {
        return request(app)
          .get("/api/articles?sort_by=votes&order_by=asc&topic=mitch")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toBeSortedBy("votes", { ascending: true });
            body.articles.forEach((article) => {
              expect(article.topic).toBe("mitch");
            });
          });
      });
      test("GET:400: should return a 400 message if sort_by is invalid format", () => {
        return request(app)
          .get("/api/articles?sort_by=notvalid")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid sort_by");
          });
      });
      test("GET:400: should return a 400 message if order_by is invalid format", () => {
        return request(app)
          .get("/api/articles?order_by=notvalid")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid sort order");
          });
      });

      test("GET:200: should return a list of 10 articles by default", () => {
        return request(app)
        .get("/api/articles?limit=1&page=1")
        .expect(200)
        .then(({ body }) => {
          console.log(body)
        })
      })
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
                article_id: 1,
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
      test("GET:200: when requesting the comments of a valid article, but one that has no comments, should receive an empty array with a status of 200", () => {
        return request(app)
          .get("/api/articles/2/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.article_comments).toEqual([]);
          });
      });
      test("GET:400: should return an invalid input message if endpoint is anything other than a number", () => {
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
      test("POST:201: should add the passed in comment to the database and return it", () => {
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
              created_at: expect.any(String),
            });
          });
      });
      test("POST:201: should ignore unecessary properties in the body and post comment as expected", () => {
        const body = {
          username: "icellusedkars",
          body: "Yeah this is totally tubular man...",
          age: 15,
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
              created_at: expect.any(String),
            });
          });
      });
      test("POST:400: should return a 400 message if ID is anything other than a number", () => {
        const body = {
          username: "icellusedkars",
          body: "Yeah this is totally tubular man...",
        };
        return request(app)
          .post("/api/articles/banana/comments")
          .send(body)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid endpoint / article ID");
          });
      });
      test("POST:400: should return 400 message if body doesn't contain both username and/or body key(s)", () => {
        const body = {
          username: "icellusedkars",
        };
        return request(app)
          .post("/api/articles/1/comments")
          .send(body)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
          });
      });
      test("POST:404: should return a 404 message if articleID is valid but doesn't exist", () => {
        const body = {
          username: "icellusedkars",
          body: "Yeah this is totally tubular man...",
        };
        return request(app)
          .post("/api/articles/506/comments")
          .send(body)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Can't find article at provided ID");
          });
      });
      test("POST:404: should return a 404 message if user doesn't exist", () => {
        const body = {
          username: "mjj677",
          body: "Yeah this is totally tubular man...",
        };
        return request(app)
          .post("/api/articles/1/comments")
          .send(body)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("User doesn't exist");
          });
      });
    });
    describe("PATCH/API/ARTICLES/:ARTICLE_ID", () => {
      test("PATCH:200: should successfully update article and return the updated article when given a positive value", () => {
        const body = { inc_votes: 10 };

        return request(app)
          .patch("/api/articles/1")
          .send(body)
          .expect(200)
          .then(({ body }) => {
            expect(body.patched_article).toMatchObject({
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 110,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            });
          });
      });
      test("PATCH:200: should successfully update article and return the updated article when given a negative value", () => {
        const body = { inc_votes: -90 };
        return request(app)
          .patch("/api/articles/1")
          .send(body)
          .expect(200)
          .then(({ body }) => {
            expect(body.patched_article).toMatchObject({
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 10,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            });
          });
      });
      test("PATCH:200: should ignore unecessary properties", () => {
        const body = { inc_votes: -90, name: "Matt" };
        return request(app)
          .patch("/api/articles/1")
          .send(body)
          .expect(200)
          .then(({ body }) => {
            expect(body).toHaveProperty("patched_article");
            expect(body.patched_article).toMatchObject({
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 10,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            });
          });
      });
      test("PATCH:400: should return 400 message if articleID is invalid", () => {
        const body = { inc_votes: 10 };
        return request(app)
          .patch("/api/articles/banana")
          .send(body)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid endpoint / article ID");
          });
      });
      test("PATCH:400: should return 400 message if missing required key", () => {
        const body = { votes: 10 };
        return request(app)
          .patch("/api/articles/1")
          .send(body)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
          });
      });
      test("PATCH:404: should return 404 message if articleID is valid but doesn't exist", () => {
        const body = { inc_votes: 10 };
        return request(app)
          .patch("/api/articles/506")
          .send(body)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Can't find article at provided ID");
          });
      });
    });
    describe("POST/API/ARTICLES", () => {
      test("POST:201: should create and return article object", () => {
        const body = {
          author: 'butter_bridge',
          title: 'TITLE',
          body: 'BODY',
          topic: 'mitch',
          article_img_url: 'URL'
        }
        return request(app)
        .post("/api/articles")
        .send(body)
        .expect(201)
        .then(({ body }) => {
          expect(body.posted_article).toMatchObject({
          author: 'butter_bridge',
          title: 'TITLE',
          body: 'BODY',
          topic: 'mitch',
          article_img_url: "URL",
          article_id: expect.any(Number)
          })
        })
      })
      test("POST:201: should ignore unecessary properties in body", () => {
        const body = {
          author: 'butter_bridge',
          title: 'TITLE',
          body: 'BODY',
          topic: 'mitch',
          article_img_url: 'URL',
          favourite_food: 'steak'
        }
        return request(app)
        .post("/api/articles")
        .send(body)
        .expect(201)
        .then(({ body }) => {
          console.log(body.posted_article)
          expect(body.posted_article).not.toHaveProperty("favourite_food")
          expect(body.posted_article).toMatchObject({
          author: 'butter_bridge',
          title: 'TITLE',
          body: 'BODY',
          topic: 'mitch',
          article_img_url: "URL",
          article_id: expect.any(Number)
          })
        })
      })
      test("POST:400: should return a 400 message if body is missing require fields", () => {
        const body = {
          author: 'butter_bridge',
          title: 'TITLE',
          topic: 'mitch',
          article_img_url: 'URL',
          favourite_food: 'steak'
        }
        return request(app)
        .post("/api/articles")
        .send(body)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad request: missing body field(s)')
        })
      })
      test("POST:404: should return a 404 message if author doesn't exist", () => {
        const body = {
          author: 'mjj677',
          title: 'TITLE',
          body: 'BODY',
          topic: 'mitch',
          article_img_url: 'URL',
        }
        return request(app)
        .post("/api/articles")
        .send(body)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Author doesn't exist")
        })
      })
      test("POST:404: should return a 404 message if topic doesn't exist", () => {
        const body = {
          author: 'butter_bridge',
          title: 'TITLE',
          body: 'BODY',
          topic: 'drinks',
          article_img_url: 'URL',
        }
        return request(app)
        .post("/api/articles")
        .send(body)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid topic")
        })
      })
    })
  });
  describe("COMMENTS", () => {
    describe("DELETE/API/COMMENTS/:COMMENT_ID", () => {
      test("DELETE:204: should return no content on successful delete", () => {
        return request(app)
          .delete("/api/comments/9")
          .expect(204)
          .then(() => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then(({ body }) => {
                body.article_comments.forEach((comment) => {
                  expect(comment.comment_id).not.toBe(9);
                });
              });
          });
      });
      test("DELETE:400: should return a 400 message if comment_id is invalid", () => {
        return request(app)
          .delete("/api/comments/banana")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid endpoint / comment ID");
          });
      });
      test("DELETE:404: should return a 404 message if comment_id is valid but doesn't exist", () => {
        return request(app)
          .delete("/api/comments/4579")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Can't find comment at provided ID");
          });
      });
    });
    describe("PATCH/API/COMMENTS/:COMMENT_ID", () => {
      test("PATCH:200: should return updated comment with the correct properties", () => {
        const body = { inc_votes: 10 };
        return request(app)
          .patch("/api/comments/1")
          .send(body)
          .expect(200)
          .then(({ body }) => {
            expect(body.patched_comment[0]).toMatchObject({
              comment_id: 1,
              body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
              article_id: 9,
              author: "butter_bridge",
              votes: 26,
              created_at: "2020-04-06T12:17:00.000Z",
            });
          });
      });
      test("PATCH:200: should return updated comment with the correct properties when given a negative inc_votes value", () => {
        const body = { inc_votes: -10 };
        return request(app)
          .patch("/api/comments/1")
          .send(body)
          .expect(200)
          .then(({ body }) => {
            expect(body.patched_comment[0]).toMatchObject({
              comment_id: 1,
              body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
              article_id: 9,
              author: "butter_bridge",
              votes: 6,
              created_at: "2020-04-06T12:17:00.000Z",
            });
          });
      });
      test("PATCH:200: should ignore unecessary properties", () => {
        const body = { inc_votes: 10, name: "Matt" };
        return request(app)
          .patch("/api/comments/1")
          .send(body)
          .expect(200)
          .then(({ body }) => {
            expect(body.patched_comment[0]).toMatchObject({
              comment_id: 1,
              body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
              article_id: 9,
              author: "butter_bridge",
              votes: 26,
              created_at: "2020-04-06T12:17:00.000Z",
            });
          });
      });
      test("PATCH:400: should return a 400 message if comment_id is invalid format", () => {
        const body = { inc_votes: 10};
        return request(app)
          .patch("/api/comments/notvalid")
          .send(body)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid comment_id type")
          });
      })
      test("PATCH:404: should return a 404 message if comment_id is valid but doesn't exist", () => {
        const body = { inc_votes: 10};
        return request(app)
          .patch("/api/comments/1923")
          .send(body)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Can't find comment at provided ID")
          });
      })
    });
  });
  describe("USERS", () => {
    describe("GET/API/USERS", () => {
      test("GET:200: should respond with a list of all users with the correct properties", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body }) => {
            expect(body.users.length).toBeGreaterThanOrEqual(4);
            body.users.forEach((user) => {
              expect(user).toMatchObject({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              });
            });
          });
      });
    });
    describe("GET/API/USERS/:USERNAME", () => {
      test("GET:200: should respond with a user object with the correct properties", () => {
        return request(app)
          .get("/api/users/butter_bridge")
          .expect(200)
          .then(({ body }) => {
            expect(body.user).toMatchObject({
              username: "butter_bridge",
              name: "jonny",
              avatar_url:
                "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
            });
          });
      });
      test("GET:404: should return a 404 message if user doesn't exist", () => {
        return request(app)
          .get("/api/users/mattjohnston")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("User doesn't exist");
          });
      });
    });
  });
});
