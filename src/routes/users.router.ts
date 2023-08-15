import { Router } from 'express'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
import {
  loginController,
  registerController,
  logoutController,
  getAccountController,
  getUserController
} from '~/controllers/users.controllers'
import { wrapHandleError } from '~/utils/handlerError'

const userRouter = Router()

userRouter.post('/login', loginValidator, wrapHandleError(loginController))
userRouter.post('/register', registerValidator, wrapHandleError(registerController))
userRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapHandleError(logoutController))
// userRouter.post('/verify-email', )
userRouter.get('/account', accessTokenValidator, wrapHandleError(getAccountController))
userRouter.get('/:userid', wrapHandleError(getUserController))

export default userRouter
