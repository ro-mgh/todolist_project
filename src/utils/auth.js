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
    return res.status(400).redirect('signup')
  }

  try {
    const newUser = await User.create({ email: newEmail, password: passw })
    const token = newToken(newUser)
    res.cookie('token', 'Bearer ' + token, { httpOnly: true }, { signed: true });
    res.status(200).redirect('/mytodolist')
  } catch (e) {
    return res.status(400).render('signup', { error: e })
  }
}

export const signin = async (req, res) => {
  const newEmail = req.body.email
  const passw = req.body.password
  // check email and passw are in the req
  if (!newEmail || !passw) {
    return res.status(401).render('signin', { error: "No data passed" })
  }

  const existingUser = await User.findOne({ email: newEmail })

  // check if uwer exists
  if (!existingUser) {
    errorHandler("No user found")
    return res.status(401).render('signin', { error: "No user found"})
  }

  // check if the passw is correct
  if (!(await existingUser.checkPassword(passw))) {
    return res.status(401).render('signin', { error: "Incorrect password" })
  }

  try {
  const token = newToken(existingUser)
  // send new token
  res.cookie('token', 'Bearer ' + token, { httpOnly: true }, { signed: true });
  return res.status(200).redirect('/mytodolist');
  } catch(e) {
    return res.status(401).render('signin', { error: e })
  }
}

export const logout = async (req, res) => {
  try {
    res.status(200).clearCookie('token').redirect('/todolist')
  } catch (e) {
    return res.status(400).render('signin', { error: e })
  }
}

export const protect = async (req, res, next) => {
  const token = req.cookies.token

  if (!isCorrectToken(token)) {
    return res.status(401).render('signin', { error: "Please signin again" })
  }

  try {
    const payload = await verifyToken(token.split('Bearer ')[1]);
    const user = await User.findById(payload.id).select('-password').lean().exec()
    req.user = user;
    next()
  } catch {
    return res.status(401).render('signin', { error: "Please signin again" })
  }
}

export const getIdFromCookie = async (cookie) => {
  const payload = await verifyToken(cookie.split('Bearer ')[1]);
  return payload.id
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
