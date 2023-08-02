import express from 'express'
import router from '~/routes/users.router'
import databaseService from './services/database.services'
const app = express()
require('dotenv').config();

const port = process.env.PORT;

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/api', router)
databaseService.connect()

app.listen(port, () => {
  console.log('Run')
})
