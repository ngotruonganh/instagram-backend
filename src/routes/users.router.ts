import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controllers'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'
import { wrapHandleError } from '~/utils/handler'

const router = Router()

router.post('/login', loginValidator, loginController)
router.post('/register', registerValidator, wrapHandleError(registerController))

export default router
