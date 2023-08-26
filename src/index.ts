import express from 'express'
import { config } from 'dotenv'
import databaseService from './services/database.services'
import userRouter from '~/routes/users.router'
import mediaRouter from '~/routes/medias.router'
import postRouter from '~/routes/posts.router'
import { defaultErrorHandler } from '~/middlewares/error.middlewares'
import cors, { CorsOptions } from 'cors'
import httpStatus from '~/constants/httpStatus'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'
import YAML from 'yaml'
import path from 'path'
import { initFolder } from '~/utils/file'

const file = fs.readFileSync(path.resolve('swagger.yaml'), 'utf8')
const swaggerDocument = YAML.parse(file)

const corsOptions: CorsOptions = {
  origin: '*'
  // credentials: true,
}

const app = express()

app.use(cors(corsOptions))

config()

const port = process.env.PORT

initFolder()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  return res.json({
    message: 'Instaggram back end',
    status: httpStatus.OK
  })
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use('/api/v1/users', userRouter)

app.use('/api/v1/posts', postRouter)

app.use('/api/v1/medias', mediaRouter)

databaseService.connect()
app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log('Run', port)
})
