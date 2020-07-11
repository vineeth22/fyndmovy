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

module.exports = {
  readAllMovies,
  readAllGenres,
};
