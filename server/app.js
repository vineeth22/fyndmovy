const express = require('express');

const app = express();
const port = 3000;
const { MongoClient } = require('mongodb');

const path = require('path');
const movie = require('./movie');

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

app.post('/api/movies/addMovie', async (req, res) => {
  const response = await movie.addMovie(db, req.body);
  res.send(response);
});

app.post('/api/movies/updateMovie/:id', async (req, res) => {
  const response = await movie.updateMovie(db, req.params.id, req.body);
  res.send(response);
});

app.post('/api/movies/addGenre', async (req, res) => {
  const response = await movie.addGenre(db, req.body);
  res.send(response);
});

app.use(express.static(path.join(__dirname, '../dist/FyndMovy')));

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
