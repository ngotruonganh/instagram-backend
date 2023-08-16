import express, { Request, Response, NextFunction } from 'express'
import { config } from 'dotenv'
import databaseService from './services/database.services'
import userRouter from '~/routes/users.router'
import { defaultErrorHandler } from '~/middlewares/error.middlewares'
import cors, { CorsOptions } from 'cors'
import postRouter from '~/routes/posts.router'

const app = express()

config()

const corsOptions: CorsOptions = {
  origin: '*'
}

app.use(cors(corsOptions))

const port = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1/users', userRouter)

app.use('/api/v1/posts', postRouter)

databaseService.connect()
app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log('Run', port)
})
