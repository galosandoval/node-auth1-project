module.exports = {
  validateUser,
  validateCreds
}

function validateUser(user){
  return Boolean(user.username && user.password && user.role)
}

function validateCreds(user){
  return Boolean(user.username && user.password)
}