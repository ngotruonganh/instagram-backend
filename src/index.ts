import express from 'express'
import router from '~/routes/users.router'
import {run} from './services/database.service'
const app = express()
require('dotenv').config();

const port = process.env.PORT;

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/api', router)
run().catch(console.dir)

app.listen(port, () => {
  console.log('Run')
})
