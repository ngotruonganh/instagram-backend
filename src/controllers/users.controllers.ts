import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { ParamsDictionary } from 'express-serve-static-core'
import User from '~/models/schemas/User.schema'
import { LogoutReqBody, RegisterReqBody, TokenPayload } from '~/models/requsets/User.requests'
import usersService from '~/services/user.services'
import databaseService from '~/services/database.services'
import { UserVerifyStatus } from '~/constants/enums'
import userServices from '~/services/user.services'
import { sendVerifyEmail } from '../../email'

export const loginController = async (req: Request, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const result = await usersService.login(user_id.toString())
  return res.json({
    message: 'Login success',
    result: result
  })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  const result = await usersService.register(req.body)
  return res.json({
    message: 'Register success',
    result: result
  })
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  const { refresh_token } = req.body
  const result = await usersService.logout(refresh_token)
  return res.json({
    message: 'Logout success',
    result: result
  })
}

export const getAccountController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const user = await usersService.getAccount(user_id)
  return res.json({
    message: 'Get account success',
    result: user
  })
}

export const getUserController = async (req: Request, res: Response, next: NextFunction) => {
  const { userid } = req.params
  const user = await usersService.getAccount(userid)
  return res.json({
    message: 'Get user success',
    result: user
  })
}

export const emailVerifyTokenController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload
  const user = await databaseService.users.findOne({
    _id: new ObjectId(user_id)
  })
  if (!user) {
    return res.status(404).json({
      message: 'User not found'
    })
  }

  if (user.email_verify_token == '') {
    return res.status(404).json({
      message: 'Verify before'
    })
  }
  const result = await usersService.verifyEmail(user_id)
  return res.json({
    message: 'Verify success',
    result
  })
}

export const resendEmailVerifyTokenController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    return res.status(422).json({
      message: 'User not found'
    })
  }
  if (user.verify === UserVerifyStatus.Verified) {
    return res.status(422).json({
      message: 'User verify before'
    })
  }
  const result = await userServices.resendVerifyEmail(user_id)
  return res.json(result)
}

export const forgotPasswordTokenController = async (req: Request, res: Response, next: NextFunction) => {
  const { _id, email } = req.user as User
  console.log('id', _id)
  const result = userServices.forgotPassword((_id as ObjectId).toString(), email)
  return res.json({ message: 'send', result })
}
