const express = require("express");
const bcryptjs = require("bcryptjs");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);

const usersRouter = require("./users/users-router");
const authRouter = require("./auth/auth-router");
const connection = require("./data/connection");

const sessionConfig = {
  name: "monster",
  secret: process.env.SESSION_SECRET || "keep it secret, keep it safe!",
  resave: false,
  saveUninitialized: true, // ask the client if its ok to save cookies
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: process.env.USE_SECURE_COOKIES || false, // true means use only over https connections
    httpOnly: true, // true means the JS code on teh clients CANNOT acccess this cookie
  },
  store: new KnexSessionStore({
    knex: connection, // knex connection to the database
    table: "sessions",
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 1000 * 60 * 60, // remove expired sessions every hour
  }),
};
const server = express();
server.use(express.json());
server.use(session(sessionConfig)); // turn on sessions, adds a req.session object

server.use("/api/users", protected, usersRouter);
server.use("/api", authRouter); // connected to register



server.get('/', (req, res) => {
  const password = req.headers.password
  const rounds = process.env.BCRYPT_ROUNDS || 4
  const hash = bcryptjs.hashSync(password, rounds)
  res.json({ api: "up", password, hash });
})

function protected(req, res, next) {
  if (req.session.username) {
    next();
  } else {
    console.log(req.session)
    res.status(401).json({ you: "shall not pass!", session: req.session });
  }
}

module.exports = server;
