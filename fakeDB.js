const fakeDB = {
  '123': {
    _id: '123',
    email: 'kunal.v.mandalia@gmail.com',
    username: 'Kunal',
    roles: ['admin'],
    password: 'Password' // bcrypt irl
  }
}

function getUserById (id) {
  const allFields = fakeDB[id]
  const safeFields = { email, username } = allFields
  return safeFields
}

function getUserByUsernamePassword (username, password, db = fakeDB) {
  return Object.keys(db)
    .map(k => db[k])
    .filter(u => u.username === username && u.password === password)
}

module.exports = {
  fakeDB,
  getUserById,
  getUserByUsernamePassword,
}
