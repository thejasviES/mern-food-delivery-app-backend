import express from 'express'
import MyUserController from '../controller/MyUserController'
import { jwtCheck, jwtParse } from '../middleware/auth'
import { validateMyUserRequest } from '../middleware/validation'

const router = express.Router()

router.post('/', jwtCheck,MyUserController.createCurrentUser)

router.get("/", jwtCheck, jwtParse, MyUserController.getCurrentUser)
router.put(
    '/',
    jwtCheck,
    jwtParse,
    validateMyUserRequest,
    MyUserController.updateCurrentUser
)

export default router
