import { Router } from 'express'
import {
  loginController,
  registerController,
  logoutController,
  getAccountController,
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
import { wrapHandleError } from '~/utils/handlerError'

const userRouter = Router()

userRouter.post('/login', loginValidator, wrapHandleError(loginController))
userRouter.post('/register', registerValidator, wrapHandleError(registerController))
userRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapHandleError(logoutController))
// userRouter.post('/verify-email', )
userRouter.get('/user', accessTokenValidator, wrapHandleError(getAccountController))

export default userRouter
