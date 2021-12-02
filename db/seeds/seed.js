const db = require("../connection.js");
const format = require("pg-format");

const seed = (data) => {
  console.log(`Running seed with ${process.env.PGDATABASE}!`);
  const { articleData, commentData, topicData, userData } = data;
  // 1. create tables
  return (
    db
      .query("DROP TABLE IF EXISTS comments;")
      .then(() => {
        return db.query("DROP TABLE IF EXISTS articles;");
      })
      .then(() => {
        return db.query("DROP TABLE IF EXISTS users;");
      })
      .then(() => {
        return db.query("DROP TABLE IF EXISTS topics;");
      })
      .then(() => {
        return db.query(
          `CREATE TABLE topics 
            (slug VARCHAR (50) PRIMARY KEY, 
            description TEXT NOT NULL);`
        );
      })
      .then(() => {
        return db.query(
          `CREATE TABLE users 
            (username VARCHAR (15) PRIMARY KEY, 
            avatar_url TEXT NOT NULL, 
            name VARCHAR (30) NOT NULL);`
        );
      })
      .then(() => {
        return db.query(
          `CREATE TABLE articles 
            (article_id SERIAL PRIMARY KEY, 
            title VARCHAR (100) NOT NULL, 
            body TEXT NOT NULL, 
            votes INT DEFAULT 0 NOT NULL, 
            topic VARCHAR NOT NULL REFERENCES topics(slug), 
            author VARCHAR NOT NULL REFERENCES users(username), 
            created_at DATE NOT NULL DEFAULT CURRENT_DATE);`
        );
      })
      .then(() => {
        return db.query(
          `CREATE TABLE comments 
            (comment_id SERIAL PRIMARY KEY, 
            author VARCHAR NOT NULL REFERENCES users(username), 
            article_id INT NOT NULL REFERENCES articles(article_id), 
            votes INT DEFAULT 0 NOT NULL, 
            created_at DATE NOT NULL DEFAULT CURRENT_DATE, 
            body TEXT);`
        );
      })
      // 2. insert data
      .then(() => {
        const formattedTopics = topicData.map((topic) => {
          return [topic.slug, topic.description];
        });
        const topicsQuery = format(
          `INSERT INTO topics
            (slug, description)
          VALUES
            %L
          RETURNING *`,
          formattedTopics
        );
        return db.query(topicsQuery);
      })
      .then(() => {
        const formattedUsers = userData.map((user) => {
          return [user.username, user.avatar_url, user.name];
        });
        const usersQuery = format(
          `INSERT INTO users
            (username, avatar_url, name)
          VALUES
            %L
          RETURNING *`,
          formattedUsers
        );
        return db.query(usersQuery);
      })
      .then(() => {
        const formattedArticles = articleData.map((article) => {
          return [
            article.title,
            article.body,
            article.votes,
            article.topic,
            article.author,
            article.created_at,
          ];
        });
        const articlesQuery = format(
          `INSERT INTO articles
            (title, body, votes, topic, author, created_at)
          VALUES
            %L
          RETURNING *`,
          formattedArticles
        );
        return db.query(articlesQuery);
      })
      .then(() => {
        const formattedComments = commentData.map((comment) => {
          return [
            comment.author,
            comment.article_id,
            comment.votes,
            comment.created_at,
            comment.body,
          ];
        });
        const commentsQuery = format(
          `INSERT INTO comments
            (author, article_id, votes, created_at, body)
          VALUES
            %L
          RETURNING *`,
          formattedComments
        );
        return db.query(commentsQuery);
      })
  );
};

module.exports = seed;
