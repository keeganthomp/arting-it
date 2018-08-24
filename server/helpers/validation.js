const bcrypt = require('bcrypt-nodejs')

const generateHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

const validPassword = (unhashedPassword, hashedPassword) => {
  return bcrypt.compareSync(unhashedPassword, hashedPassword)
}

module.exports = {
  generateHash,
  validPassword
}
