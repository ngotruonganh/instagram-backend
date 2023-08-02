import {Router} from "express";
import {Home} from '~/controllers/users.controllers'
import {HomeMiddle} from '~/middlewares/users.middlewares'

const router = Router()

router.post('/', HomeMiddle, Home)

router.get('/', HomeMiddle, Home)

export default router
