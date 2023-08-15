import { Router } from 'express'

import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { createPostController } from '~/controllers/posts.controllers'
import { wrapHandleError } from '~/utils/handlerError'

const postRouter = Router()

postRouter.post('/', accessTokenValidator, wrapHandleError(createPostController))

export default postRouter
