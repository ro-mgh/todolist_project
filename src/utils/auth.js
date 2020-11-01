import config from '../config'
import { User } from '../resources/user/user.model'
import jwt from 'jsonwebtoken'

export const newToken = user => {
  return jwt.sign({ id: user.id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp
  })
}

export const verifyToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })

export const signup = async (req, res) => {
  const newEmail = req.body.email
  const passw = req.body.password
  if (!newEmail || !passw) {
    return res.status(400).send({ message: 'no data' })
  }

  const newUser = await User.create({ email: newEmail, password: passw })

  const token = newToken(newUser)

  return res.status(201).send({ token })
}

export const signin = async (req, res) => {
  const newEmail = req.body.email
  const passw = req.body.password
  // check email and passw are in the req
  if (!newEmail || !passw) {
    return res.status(400).send({ message: 'no data' })
  }

  const existingUser = await User.findOne({ email: newEmail })

  // check if uwer exists
  if (!existingUser) {
    return res.status(401).send({ message: 'no user found' })
  }

  // check if the passw is correct
  if (!(await existingUser.checkPassword(passw))) {
    return res.status(401).send({ message: 'incorrect password' })
  }

  const token = newToken(existingUser)
  // send new token
  return res.status(201).send({ token })
}

export const protect = async (req, res, next) => {
  const token = req.headers.authorization

  if (!isCorrectToken(token)) {
    return res.status(401).end()
  }
//{_id: payload.id};
  try {
    const payload = await verifyToken(token.split('Bearer ')[1])
    const user = await User.findById(payload.id).select('-password').lean().exec()
    req.user = user;
    next()
  } catch {
    return res.status(401).end()
  }
}

const isCorrectToken = token => {
  const regexToken = new RegExp(/Bearer\s.+/)
  if (typeof token === 'string') {
    if (regexToken)
      if (regexToken.test(token)) {
        return true
      }
  }
  return false
}
