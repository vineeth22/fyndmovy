const { ObjectId } = require('mongodb');

const stringInvalid = (str) => {
  return !str || typeof str !== 'string' || str.trim().length === 0;
};

const readAllMovies = async (db) => {
  try {
    const col = db.collection('imdb');
    const docs = await col.find().toArray();
    return docs;
  } catch (err) {
    console.log(err.stack);
    return null;
  }
};

const readAllGenres = async (db) => {
  try {
    const col = db.collection('genre');
    const docs = await col.find().toArray();
    return docs;
  } catch (err) {
    console.log(err.stack);
    return null;
  }
};

const readMovie = async (db, id) => {
  try {
    const col = db.collection('imdb');
    const doc = await col.findOne({ _id: new ObjectId(id) });
    return doc;
  } catch (err) {
    console.log(err.stack);
    return null;
  }
};

const addMovie = async (db, movie) => {
  try {
    if (
      stringInvalid(movie.name) ||
      stringInvalid(movie.director) ||
      movie.genre.length === 0 ||
      typeof movie.imdb_score !== 'number' ||
      typeof movie['99popularity'] !== 'number'
    )
      return 'Invalid Data';

    const data = {
      name: movie.name.trim(),
      director: movie.director.trim(),
      genre: movie.genre,
      '99popularity': movie['99popularity'],
      imdb_score: movie.imdb_score,
    };

    const genres = await db
      .collection('genre')
      .find({ name: { $in: data.genre } })
      .toArray();
    if (genres.length !== data.genre.length) return 'Error: Invalid genre';

    const col = db.collection('imdb');
    const r = await col.insertOne(data);
    return r.insertedCount === 1 ? 'Success' : 'Error';
  } catch (err) {
    console.log(err.stack);
    return 'Error';
  }
};

const updateMovie = async (db, id, movie) => {
  try {
    if (
      stringInvalid(movie.name) ||
      stringInvalid(movie.director) ||
      movie.genre.length === 0 ||
      typeof movie.imdb_score !== 'number' ||
      typeof movie['99popularity'] !== 'number'
    )
      return 'Invalid Data';

    const data = {
      name: movie.name.trim(),
      director: movie.director.trim(),
      genre: movie.genre,
      '99popularity': movie['99popularity'],
      imdb_score: movie.imdb_score,
    };

    const prevData = await readMovie(db, id);
    if (prevData.name !== data.name) return 'Error: Movie name cannot be changed';

    const genres = await db
      .collection('genre')
      .find({ name: { $in: data.genre } })
      .toArray();
    if (genres.length !== data.genre.length) return 'Error: Invalid genre';

    const col = db.collection('imdb');
    const r = await col.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: data,
      }
    );
    return r.matchedCount === 1 ? 'Success' : 'Error';
  } catch (err) {
    console.log(err.stack);
    return 'Error';
  }
};

const addGenre = async (db, genre) => {
  try {
    if (stringInvalid(genre.name)) return 'Invalid Data';
    const data = {
      name: genre.name.trim(),
    };

    const prevGenre = await db.collection('genre').find(data).toArray();
    if (prevGenre.length !== 0) return 'Error: Genre already exists';

    const r = await db.collection('genre').insertOne(data);
    return r.insertedCount === 1 ? 'Success' : 'Error';
  } catch (err) {
    console.log(err.stack);
    return 'Error';
  }
};

module.exports = {
  readAllMovies,
  readAllGenres,
  readMovie,
  addMovie,
  updateMovie,
  addGenre,
};
