import { Router } from 'express'
import {
  accessTokenValidator,
  changePasswordValidator,
  emailVerifyTokenValidator,
  followValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  unfollowValidator,
  verifiedUserValidator,
  verifyForgotPasswordValidator
} from '~/middlewares/users.middlewares'
import {
  loginController,
  registerController,
  logoutController,
  getAccountController,
  getUserController,
  emailVerifyTokenController,
  resendEmailVerifyTokenController,
  forgotPasswordTokenController,
  verifyForgotPasswordTokenController,
  resetPasswordTokenController,
  refreshTokenController,
  followController,
  unfollowController,
  changePasswordController,
  getFollowerController
} from '~/controllers/users.controllers'
import { wrapHandleError } from '~/utils/handlerError'

const userRouter = Router()

userRouter.post('/login', loginValidator, wrapHandleError(loginController))
userRouter.post('/register', registerValidator, wrapHandleError(registerController))
userRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapHandleError(logoutController))
userRouter.post('/refresh-token', refreshTokenValidator, wrapHandleError(refreshTokenController))
userRouter.post(
  '/verify-email',
  accessTokenValidator,
  emailVerifyTokenValidator,
  wrapHandleError(emailVerifyTokenController)
)
userRouter.post('/resend-verify-email', accessTokenValidator, wrapHandleError(resendEmailVerifyTokenController))
userRouter.post('/forgot-password', forgotPasswordValidator, wrapHandleError(forgotPasswordTokenController))
userRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordValidator,
  wrapHandleError(verifyForgotPasswordTokenController)
)
userRouter.post('/reset-password', resetPasswordValidator, wrapHandleError(resetPasswordTokenController))
userRouter.get('/account', accessTokenValidator, wrapHandleError(getAccountController))
userRouter.get('/:userid', wrapHandleError(getUserController))
userRouter.post(
  '/follow',
  accessTokenValidator,
  // verifiedUserValidator,
  followValidator,
  wrapHandleError(followController)
)
userRouter.delete(
  '/follow/:user_id',
  accessTokenValidator,
  // verifiedUserValidator,
  unfollowValidator,
  wrapHandleError(unfollowController)
)
userRouter.put(
  '/change-password',
  accessTokenValidator,
  // verifiedUserValidator,
  changePasswordValidator,
  wrapHandleError(changePasswordController)
)
userRouter.post('/follower', accessTokenValidator, wrapHandleError(getFollowerController))

export default userRouter
