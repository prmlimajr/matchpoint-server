const bcrypt = require('bcryptjs');

const checkPassword = (password, hash) => {
  return bcrypt.compare(password, hash);
};

module.exports = { checkPassword }