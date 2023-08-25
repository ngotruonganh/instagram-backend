import { Router } from 'express'
import { mediaController } from '~/controllers/mediaController'
import {wrapHandleError} from "~/utils/handlerError";

const mediaRouter = Router()

mediaRouter.post('/upload-image',  wrapHandleError(mediaController))

export default mediaRouter
