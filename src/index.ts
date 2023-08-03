import express from 'express'
import { Request, Response, NextFunction } from 'express'
import router from '~/routes/users.router'
import databaseService from './services/database.services'
const app = express()
import { config } from 'dotenv'
config()

const port = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', router)
databaseService.connect()
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(400).json({ error: 'error' })
})

app.listen(port, () => {
  console.log('Run')
})
