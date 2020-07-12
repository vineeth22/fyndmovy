const bcrypt = require('bcrypt');

const authUser = async (db, user) => {
  const data = await db.collection('user').find({ username: user.username }).toArray();
  if (data.length !== 1) return { isLoggedIn: false };
  const match = await bcrypt.compare(user.password, data[0].password);
  return { isLoggedIn: match };
};

module.exports = {
  authUser,
};
