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

app.use(express.static(path.join(__dirname, '../dist/FyndMovy')));
app.get('/movies/getAllMovies', async (req, res) => {
  const movies = await movie.readAllMovies(db);
  res.send(movies);
});

app.get('/movies/getAllGenres', async (req, res) => {
  const genres = await movie.readAllGenres(db);
  res.send(genres);
});

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
