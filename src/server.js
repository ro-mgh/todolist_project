import express from 'express'
import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
import config from './config'
import cors from 'cors'
import { connect } from './utils/db'
import itemRouter from './resources/item/item.router'
import { signin, signup, protect, logout } from './utils/auth'
import path from 'path'
import cookieParser from 'cookie-parser'
import { renderMyPage } from './utils/main_page'

export const app = express()

app.disable('x-powered-by')

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(cookieParser())

app.post('/signup', signup)
app.post('/signin', signin)
app.use('/logout', logout)

app.use('/mytodolist', protect)

// rendering page for user

app.get('/mytodolist', renderMyPage)
app.use('/mytodolist/item', itemRouter)

// test res**
// app.put('/test/item', async (req, res) => {
//   const createdBy = await getIdFromCookie(req.cookies.token)
//   const id = req.body.id
//   const change = req.body.toChange
//   console.log(createdBy)
//   console.log(id)
//   console.log(change)
// })
// **********

// static to css
app.use(express.static(path.join(__dirname, '../public')))

app.set('view engine', 'pug')

app.use('/mytodolist', (req, res) => {
  res.render('mytodolistpage')
})

app.use('/todolist', (req, res) => {
  res.render('todolistpage')
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
      console.log(`TODO app on http://localhost:${config.port}/todolist`)
    })
  } catch (e) {
    console.error(e)
  }
}
