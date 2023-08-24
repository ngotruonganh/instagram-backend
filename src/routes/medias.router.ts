import { Router } from 'express'
import { mediaController } from '~/controllers/mediaController'

const mediaRouter = Router()

mediaRouter.post('/upload-image', mediaController)

export default mediaRouter
