const express = require('express');
const usersRouter = require('./users/userRouter.js');
const postsRouter = require('./posts/postRouter.js');

const server = express();

server.use(express.json());


//custom middleware

function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] method: ${req.method} url: ${req.url}]`
  );
  next();
};
server.use(logger);

server.use('/users', usersRouter);
server.use('/posts', postsRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

module.exports = server;
