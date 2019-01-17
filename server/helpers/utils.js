require('dotenv').config()
const jwt = require('jsonwebtoken')

const generateToken = (user) => {
  //1. Dont use password and other sensitive fields
  //2. Use fields that are useful in other parts of the     
  //app/collections/models
  const u = {
    id: user.id.toString(),
    username: user.username,
    firstName: user.first_name,
    lastName: user.last_name,
    specialty: user.specialty,
    location: user.location,
    age: user.age,
    avatar: user.avatar,
    art: user.art,
    createdAt: user.createdAt.toString(),
    updatedAt: user.updatedAt.toString()
  }
  return jwt.sign(u, process.env.JWT_SECRET, {
    expiresIn: 60 * 60 * 24 // expires in 24 hours
  })
}

module.exports = {
  generateToken
}