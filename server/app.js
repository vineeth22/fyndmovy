const express = require('express');

const app = express();
const port = 3000;
const { MongoClient } = require('mongodb');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

const path = require('path');
const movie = require('./movie');
const auth = require('./auth');

const url = 'mongodb://localhost:27017';
const dbName = 'fyndmovy';
let db;

// eslint-disable-next-line func-names
(async function () {
  const client = new MongoClient(url, { useUnifiedTopology: true });
  try {
    await client.connect();
    console.log('Connected correctly to server');
    db = client.db(dbName);
  } catch (err) {
    console.log(err.stack);
  }
})();

app.use(
  session({
    store: new FileStore(),
    secret: '7595CDDED75A2D24A2CA45A64743C',
    resave: true,
    saveUninitialized: true,
    maxAge: 24 * 60 * 60 * 1000,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/movies/getAllMovies', async (req, res) => {
  const movies = await movie.readAllMovies(db);
  res.send(movies);
});

app.get('/api/movies/getAllGenres', async (req, res) => {
  const genres = await movie.readAllGenres(db);
  res.send(genres);
});

app.get('/api/movies/getMovie/:id', async (req, res) => {
  const movieData = await movie.readMovie(db, req.params.id);
  res.send(movieData);
});

app.get('/api/auth/isLoggedIn', (req, res) => {
  if (req.session.user) {
    res.send({ isLoggedIn: true });
  } else {
    res.send({ isLoggedIn: false });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const response = await auth.authUser(db, req.body);
  if (response.isLoggedIn) req.session.user = req.body.username;
  res.send(response);
});

app.get('/api/auth/logout', (req, res) => {
  delete req.session.user;
  res.send({ isLoggedIn: false });
});

const authHandler = (req, res, next) => {
  if (req.session.user) {
    if (req.route.path !== '/api/auth/logs')
      db.collection('logs').insertOne({
        user: req.session.user,
        route: req.route.path,
        params: req.params,
        body: req.body,
        createdAt: new Date(),
      });
    next();
  } else {
    res.send('User not authenticated');
  }
};

app.post('/api/movies/addMovie', authHandler, async (req, res) => {
  const response = await movie.addMovie(db, req.body);
  res.send(response);
});

app.post('/api/movies/updateMovie/:id', authHandler, async (req, res) => {
  const response = await movie.updateMovie(db, req.params.id, req.body);
  res.send(response);
});

app.post('/api/movies/deleteMovie', authHandler, async (req, res) => {
  const response = await movie.deleteMovie(db, req.body.id);
  res.send(response);
});

app.post('/api/movies/addGenre', authHandler, async (req, res) => {
  const response = await movie.addGenre(db, req.body);
  res.send(response);
});

app.get('/api/auth/logs', authHandler, async (req, res) => {
  const response = await db.collection('logs').find().sort({ createdAt: -1 }).toArray();
  res.send(response);
});

app.use(express.static(path.join(__dirname, '../dist/FyndMovy')));

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
