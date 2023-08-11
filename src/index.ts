import express, { Request, Response, NextFunction } from 'express'
import { config } from 'dotenv'
import databaseService from './services/database.services'
import userRouter from '~/routes/users.router'
import {defaultErrorHandler} from "~/middlewares/error.middleware";

const app = express()
config()

const port = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/v1/users', userRouter)
databaseService.connect()
app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log('Run')
})
