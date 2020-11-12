import express from 'express'
import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
import config from './config'
import cors from 'cors'
import { connect } from './utils/db'
import userRouter from './resources/user/user.router'
import itemRouter from './resources/item/item.router'
import listRouter from './resources/list/list.router'
import { signin, signup, protect } from './utils/auth'
import path from 'path'
import cookieParser from 'cookie-parser'

export const app = express()

app.disable('x-powered-by')

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(cookieParser())

app.post('/signup', signup)
app.post('/signin', signin)

app.use('/mytodolist', protect)
app.use('/api/user', userRouter)
app.use('/api/item', itemRouter)
app.use('/api/list', listRouter)

// test res**
app.get('/test', (req, res) => {
  let cookie = req.cookies.token
  res.send({ message: cookie })
})
// **********

// static to css
app.use(express.static(path.join(__dirname, '../public')))

app.set('view engine', 'pug')

app.use('/mytodolist', (req, res) => {
  res.render('main')
})

app.use('/signin', (req, res) => {
  res.render('signin')
})

app.use('/signup', (req, res) => {
  res.render('signup')
})

export const start = async () => {
  try {
    await connect()
    app.listen(config.port, () => {
      console.log(`REST API on http://localhost:${config.port}/api`)
    })
  } catch (e) {
    console.error(e)
  }
}
