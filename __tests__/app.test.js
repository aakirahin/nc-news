const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const app = require("../app.js");
const request = require("supertest");
const endpoints = require("../endpoints.json");
require("jest-sorted");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topics).toBeInstanceOf(Array);
        response.body.topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("responds with an article object of given id", () => {
    const articleID = 2;
    return request(app)
      .get(`/api/articles/${articleID}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body.articleID).toEqual(articleID);
      });
  });

  test("throws an error if ID is an invalid data type", () => {
    const articleID = "string";
    return request(app).get(`/api/articles/${articleID}`).expect(400);
  });

  test("throws an error if ID does not exist", () => {
    const articleID = 889;
    return request(app).get(`/api/articles/${articleID}`).expect(404);
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("request body accepts an object which updates the votes of the specified article", () => {
    const articleID = 2;
    const newVote = { inc_votes: 2 };
    return request(app)
      .patch(`/api/articles/${articleID}`)
      .send(newVote)
      .expect(200)
      .then((response) => {
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body.articleID).toBe(2);
        expect(response.body.updatedArticleInfo.votes).toBe(2);
        expect(response.body.updatedArticleInfo).not.toBe(
          testData.articleData[articleID - 1]
        );
      });
  });

  test("throws an error if request body is empty", () => {
    const articleID = 2;
    return request(app).patch(`/api/articles/${articleID}`).send().expect(400);
  });

  test("throws an error if request body is an empty object", () => {
    const articleID = 2;
    const newVote = {};
    return request(app)
      .patch(`/api/articles/${articleID}`)
      .send(newVote)
      .expect(400);
  });

  test("throws an error if request body does not have inc_votes property", () => {
    const articleID = 2;
    const newVote = { votes: 2 };
    return request(app)
      .patch(`/api/articles/${articleID}`)
      .send(newVote)
      .expect(400);
  });

  test("throws an error if the value of inc_votes is invalid", () => {
    const articleID = 2;
    const newVote = { inc_votes: "string" };
    return request(app)
      .patch(`/api/articles/${articleID}`)
      .send(newVote)
      .expect(400);
  });

  test("throws an error if there is another property in the request body", () => {
    const articleID = 2;
    const newVote = { inc_votes: 2, name: "Mitch" };
    return request(app)
      .patch(`/api/articles/${articleID}`)
      .send(newVote)
      .expect(422);
  });
});

describe.only("GET /api/articles", () => {
  test("responds with an array of article objects, which is sorted chronologically by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeInstanceOf(Array);
        response.body.articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
          });
        });
        expect(response.body.articles).toBeSortedBy("created_at", {
          coerce: true,
        });
      });
  });

  test("accepts sort_by query which sorts the articles by article_id", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toBeSortedBy("article_id");
      });
  });

  test("accepts sort_by query which sorts the articles by votes", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toBeSortedBy("votes");
      });
  });

  test("throws an error if sort_by query is for a non-existing column", () => {
    return request(app).get("/api/articles?sort_by=random").expect(400);
  });

  test("accepts order query which can sort articles in descending order of created_at", () => {
    return request(app)
      .get("/api/articles?order=desc")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toBeSortedBy("created_at", {
          coerce: true,
          descending: true,
        });
      });
  });

  test("accepts order query which sorts the articles in given order by sort_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=desc")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toBeSortedBy("votes", {
          descending: true,
        });
      });
  });

  test("throws an error if order query is invalid", () => {
    return request(app).get("/api/articles?order=increase").expect(400);
  });

  test("accepts topic query which filters articles of that topic", () => {
    const topic = "mitch";
    return request(app)
      .get(`/api/articles?topic=${topic}`)
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toBeInstanceOf(Array);
        articles.forEach((article) => {
          expect(article.topic).toEqual(topic);
        });
      });
  });

  test("throws an error if topic query does not exist", () => {
    return request(app).get("/api/articles?topic=weather").expect(400);
  });

  test("throws an error if there are no related articles of the topic", () => {
    return request(app).get("/api/articles?topic=weather").expect(422);
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("responds with an array of comment objects for the given article ID", () => {
    const articleID = 1;
    return request(app)
      .get(`/api/articles/${articleID}/comments`)
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toBeInstanceOf(Array);
        response.body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            article_id: articleID,
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
          });
        });
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("request body accepts an object to post a comment", () => {
    const articleID = 2;
    const newComment = { username: "butter_bridge", body: "interesting" };
    expect(
      testData.userData.some((user) => user.username === newComment.username)
    ).toBe(true);
    return request(app)
      .post(`/api/articles/${articleID}/comments`)
      .send(newComment)
      .expect(201)
      .then((response) => {
        console.log(response.body);
        expect(response.body.comment).toBeInstanceOf(Object);
        expect(response.body.comment).toMatchObject({
          body: newComment.body,
          votes: 0,
          author: newComment.username,
          article_id: articleID,
          created_at: expect.any(String),
        });
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("deletes comment of the given ID", () => {
    const commentID = 13;
    return request(app)
      .del(`/api/comments/${commentID}`)
      .expect(204)
      .then((response) => {
        expect(response.res.statusMessage).toEqual("No Content");
      });
  });
});

describe("GET /api", () => {
  test("responds with all the available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body.endpoints).toBeInstanceOf(Object);
        expect(response.body.endpoints).toEqual(endpoints);
      });
  });

  test("throws an error if route is invalid", () => {
    return request(app)
      .get("/not-a-route")
      .expect(404)
      .then((response) => {
        //
      });
  });
});
