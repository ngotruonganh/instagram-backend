import { Router } from 'express'
import {
  accessTokenValidator,
  emailValidator,
  emailVerifyTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
import {
  loginController,
  registerController,
  logoutController,
  getAccountController,
  getUserController,
  emailVerifyTokenController,
  resendEmailVerifyTokenController,
  forgotPasswordTokenController
} from '~/controllers/users.controllers'
import { wrapHandleError } from '~/utils/handlerError'

const userRouter = Router()

userRouter.post('/login', loginValidator, wrapHandleError(loginController))
userRouter.post('/register', registerValidator, wrapHandleError(registerController))
userRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapHandleError(logoutController))
userRouter.post(
  '/verify-email',
  accessTokenValidator,
  emailVerifyTokenValidator,
  wrapHandleError(emailVerifyTokenController)
)
userRouter.post('/resend-verify-email', accessTokenValidator, wrapHandleError(resendEmailVerifyTokenController))
userRouter.post('/forgot-password', emailValidator, wrapHandleError(forgotPasswordTokenController))
userRouter.get('/account', accessTokenValidator, wrapHandleError(getAccountController))
userRouter.get('/:userid', wrapHandleError(getUserController))

export default userRouter
