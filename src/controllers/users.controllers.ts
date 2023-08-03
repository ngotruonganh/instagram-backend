import { Request, Response } from 'express'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import { ParamsDictionary } from 'express-serve-static-core'
import usersService from '~/services/user.services'
import { RegisterReqBody } from '~/models/requsets/User.requests'
import {ObjectId} from "mongodb";

export const loginController = async (req: Request, res: Response) => {
  const user= req.user as User
  const user_id= user._id as ObjectId
  const result = await usersService.login(user_id.toString())
  return res.json({
    message: 'Login success',
    result
  })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  try {
    const result = await usersService.register(req.body)
    // await databaseService.users.find({})
    return res.json({
      message: 'Register success',
      result
    })
  } catch (error) {
    return res.status(400).json({
      message: 'Register failed',
      error
    })
  }
}
