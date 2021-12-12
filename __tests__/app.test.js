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
        expect(response.body.topics.length).not.toBe(0);
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

  test("throws an error if route is invalid", () => {
    return request(app).get("/api/not-a-route").expect(404);
  });
});

describe("GET /api/articles/:article_id", () => {
  test("responds with an article object of given id", () => {
    const articleID = 2;
    return request(app)
      .get(`/api/articles/${articleID}`)
      .expect(200)
      .then((response) => {
        expect(response.body.article).toBeInstanceOf(Object);
        expect(response.body.article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: articleID,
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(String),
        });
      });
  });

  test("throws an error if article ID is an invalid data type", () => {
    const articleID = "string";
    return request(app).get(`/api/articles/${articleID}`).expect(400);
  });

  test("throws an error if article ID does not exist", () => {
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
        expect(response.body.updatedArticleInfo).toBeInstanceOf(Object);
        expect(response.body.updatedArticleInfo.article_id).toBe(articleID);
        expect(response.body.updatedArticleInfo.votes).toBe(2);
      });
  });

  test("throws an error if article ID is an invalid data type", () => {
    const articleID = "string";
    const newVote = { inc_votes: 2 };
    return request(app)
      .patch(`/api/articles/${articleID}`)
      .send(newVote)
      .expect(400);
  });

  test("throws an error if article ID does not exist", () => {
    const articleID = 899;
    const newVote = { inc_votes: 2 };
    return request(app)
      .patch(`/api/articles/${articleID}`)
      .send(newVote)
      .expect(404);
  });

  test("no effect to article if request body does not have inc_votes property", () => {
    const articleID = 2;
    const newVote = { votes: 2 };
    return request(app)
      .patch(`/api/articles/${articleID}`)
      .send(newVote)
      .expect(200)
      .then((response) => {
        expect(response.body.updatedArticleInfo).toBeInstanceOf(Object);
        expect(response.body.updatedArticleInfo.article_id).toBe(articleID);
        expect(response.body.updatedArticleInfo.votes).toBe(0);
      });
  });
});

describe("GET /api/articles", () => {
  test("responds with an array of article objects, which is sorted chronologically by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeInstanceOf(Array);
        expect(response.body.articles.length).not.toBe(0);
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
          descending: true,
        });
      });
  });

  test("accepts sort_by query which sorts the articles by article_id", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeInstanceOf(Array);
        expect(response.body.articles).toBeSortedBy("article_id", {
          descending: true,
        });
      });
  });

  test("accepts sort_by query which sorts the articles by votes", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeInstanceOf(Array);
        expect(response.body.articles).toBeSortedBy("votes", {
          descending: true,
        });
      });
  });

  test("throws an error if sort_by query is for a non-existing column", () => {
    return request(app).get("/api/articles?sort_by=random").expect(400);
  }); //

  test("accepts order query which can sort articles in ascending order of default sort_by", () => {
    return request(app)
      .get("/api/articles?order=desc")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeInstanceOf(Array);
        expect(response.body.articles).toBeSortedBy("created_at", {
          coerce: true,
        });
      });
  });

  test("accepts order query which sorts the articles in given order of sort_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=desc")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeInstanceOf(Array);
        expect(response.body.articles).toBeSortedBy("votes", {
          descending: true,
        });
      });
  });

  test("throws an error if order query is invalid", () => {
    return request(app).get("/api/articles?order=increase").expect(400);
  }); //

  test("accepts topic query which filters articles of that topic", () => {
    const topic = "mitch";
    return request(app)
      .get(`/api/articles?topic=${topic}`)
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeInstanceOf(Array);
        expect(response.body.articles.length).not.toBe(0);
        response.body.articles.forEach((article) => {
          expect(article.topic).toEqual(topic);
        });
      });
  });

  test("throws an error if topic query does not exist", () => {
    return request(app).get("/api/articles?topic=weather").expect(404);
  });

  test("responds with an empty array if there are no related articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeInstanceOf(Array);
        expect(response.body.articles.length).toBe(0);
      });
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
        expect(response.body.comments.length).not.toBe(0);
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

  test("throws an error if article ID is an invalid data type", () => {
    const articleID = "string";
    return request(app).get(`/api/articles/${articleID}/comments`).expect(400);
  });

  test("throws an error if article ID does not exist", () => {
    const articleID = 899;
    return request(app).get(`/api/articles/${articleID}/comments`).expect(404);
  });

  test("responds with an empty array if there are no comments under that article", () => {
    const articleID = 2;
    return request(app)
      .get(`/api/articles/${articleID}/comments`)
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toEqual([]);
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("request body accepts an object to post a comment", () => {
    const articleID = 2;
    const newComment = { username: "butter_bridge", body: "interesting" };
    return request(app)
      .post(`/api/articles/${articleID}/comments`)
      .send(newComment)
      .expect(201)
      .then((response) => {
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

  test("throws an error if article ID is an invalid data type", () => {
    const articleID = "string";
    const newComment = { username: "butter_bridge", body: "interesting" };
    return request(app)
      .post(`/api/articles/${articleID}/comments`)
      .send(newComment)
      .expect(400);
  });

  test("throws an error if article ID does not exist", () => {
    const articleID = 899;
    const newComment = { username: "butter_bridge", body: "interesting" };
    return request(app)
      .post(`/api/articles/${articleID}/comments`)
      .send(newComment)
      .expect(404);
  });

  test("throws an error if request body does not have a username property", () => {
    const articleID = 2;
    const newComment = { body: "interesting" };
    return request(app)
      .post(`/api/articles/${articleID}/comments`)
      .send(newComment)
      .expect(400);
  });

  test("throws an error if request body does not have a body property", () => {
    const articleID = 2;
    const newComment = { username: "butter_bridge" };
    return request(app)
      .post(`/api/articles/${articleID}/comments`)
      .send(newComment)
      .expect(400);
  });

  test("throws an error if username does not exist", () => {
    const articleID = 2;
    const newComment = {
      username: "niharika",
      body: "interesting",
    };
    return request(app)
      .post(`/api/articles/${articleID}/comments`)
      .send(newComment)
      .expect(405);
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

  test("throws an error if comment ID is an invalid data type", () => {
    const commentID = "string";
    return request(app).del(`/api/comments/${commentID}`).expect(400);
  });

  test("throws an error if comment ID is does not exist", () => {
    const commentID = 889;
    return request(app).del(`/api/comments/${commentID}`).expect(404);
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
    return request(app).get("/not-a-route").expect(404);
  });
});

describe("GET /api/users", () => {
  test("responds with an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        expect(response.body.users).toBeInstanceOf(Array);
        expect(response.body.users.length).not.toBe(0);
        response.body.users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
            })
          );
        });
      });
  });

  test("throws an error if route is invalid", () => {
    return request(app).get("/api/not-a-route").expect(404);
  });
});

describe("GET /api/users/:username", () => {
  test("responds with a user object of given id", () => {
    const username = "icellusedkars";
    return request(app)
      .get(`/api/users/${username}`)
      .expect(200)
      .then((response) => {
        expect(response.body.user).toBeInstanceOf(Object);
        expect(response.body.user).toEqual(
          expect.objectContaining({
            username: username,
            avatar_url: expect.any(String),
            name: expect.any(String),
          })
        );
      });
  });

  test("throws an error if username does not exist", () => {
    const username = "niharika";
    return request(app).get(`/api/users/${username}`).expect(404);
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("request body accepts an object which updates the specified comment", () => {
    const commentID = 8;
    const editedComment = {
      username: "icellusedkars",
      body: "Delicious knekkebrod",
    };
    return request(app)
      .patch(`/api/comments/${commentID}`)
      .send(editedComment)
      .expect(200)
      .then((response) => {
        expect(response.body.editedComment).toBeInstanceOf(Object);
        expect(response.body.editedComment.comment_id).toBe(commentID);
        expect(response.body.editedComment.body).toEqual(editedComment.body);
      });
  });

  test("throws an error if comment ID is an invalid data type", () => {
    const commentID = "string";
    const editedComment = {
      username: "icellusedkars",
      body: "Delicious knekkebrod",
    };
    return request(app)
      .patch(`/api/comments/${commentID}`)
      .send(editedComment)
      .expect(400);
  });

  test("throws an error if comment ID does not exist", () => {
    const commentID = 889;
    const editedComment = {
      username: "icellusedkars",
      body: "Delicious knekkebrod",
    };
    return request(app)
      .patch(`/api/comments/${commentID}`)
      .send(editedComment)
      .expect(404);
  });

  test("throws an error if request body does not have a username property", () => {
    const commentID = 8;
    const editedComment = {
      body: "Delicious knekkebrod",
    };
    return request(app)
      .patch(`/api/comments/${commentID}`)
      .send(editedComment)
      .expect(400);
  });

  test("throws an error if request body does not have a body property", () => {
    const commentID = 8;
    const editedComment = {
      username: "icellusedkars",
    };
    return request(app)
      .patch(`/api/comments/${commentID}`)
      .send(editedComment)
      .expect(400);
  });

  test("throws an error if username does not exist", () => {
    const commentID = 8;
    const editedComment = {
      username: "niharika",
      body: "Delicious knekkebrod",
    };
    return request(app)
      .patch(`/api/comments/${commentID}`)
      .send(editedComment)
      .expect(405);
  });
});
