const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session')
const SessionStore = require('connect-session-knex')(session)

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session({
  name: 'web23',
  secret: process.env.SECRET || 'secret key',
  cookie: {
    maxAge: 1000 * 60 * 60, // 1 hour in milliseconds
    secure: process.env.NODE_ENV === 'development' ? false : true,
    httpOnly: true,
    resave: false,
    saveUninitialized: process.env.NODE_ENV === 'development' ? true : false,
    store: new SessionStore({
      knex: require('../database/dbConfig'),
      clearInterval: 1000* 60 * 10, // delete expired sessions every 10 min 
      tablename: 'user_sessions',
      createtable: true,
    }),
  }
}))

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.json({ api: 'up', session: req.session });
});

module.exports = server;
