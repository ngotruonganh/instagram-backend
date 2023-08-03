import { Router } from 'express'
import { loginController, logoutController, registerController } from '~/controllers/users.controllers'
import { loginValidator, logoutValidator, registerValidator } from '~/middlewares/users.middlewares'
import { wrapHandleError } from '~/utils/handler'

const router = Router()

router.post('/users/login', loginValidator, loginController)
router.post('/users/register', registerValidator, wrapHandleError(registerController))
router.post('/users/logout', logoutValidator, wrapHandleError(logoutController))

export default router
