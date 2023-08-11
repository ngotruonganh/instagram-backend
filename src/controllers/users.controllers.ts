import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { ParamsDictionary } from 'express-serve-static-core'
import User from '~/models/schemas/User.schema'
import { RegisterReqBody } from '~/models/requsets/User.requests'
import usersService from '~/services/user.services'

export const loginController = async (req: Request, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const result = await usersService.login(user_id.toString())
  return res.json({
    message: 'Login success',
    result
  })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  const result = await usersService.register(req.body)
  return res.json({
    message: 'Register success',
    result
  })
}

export const logoutController = async (req: Request, res: Response) => {
  const { refresh_token } = req.body
  const result = await usersService.logout(refresh_token)
  return res.json(result)
}
