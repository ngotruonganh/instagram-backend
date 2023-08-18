import { ObjectId } from 'mongodb'
import { config } from 'dotenv'
import User from '~/models/schemas/User.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { RegisterReqBody } from '~/models/requsets/User.requests'
import { TokenType, UserVerifyStatus } from '~/constants/enums'
import databaseService from '~/services/database.services'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import * as process from 'process'
import { sendVerifyEmail } from '../../email'

config()

class UsersService {
  private signAccessToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken
      },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
      }
    })
  }
  private signRefreshToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken
      },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
      }
    })
  }
  private signVerifyEmailToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.EmailVerifyToken
      },
      privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
      options: {
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN
      }
    })
  }
  private signForgotPasswordToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.ForgotPasswordToken
      },
      privateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,
      options: {
        expiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN
      }
    })
  }
  private signAccessAndRefreshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }
  async login(user_id: string) {
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id)
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
    )
    return {
      access_token,
      refresh_token
    }
  }
  async register(payload: RegisterReqBody) {
    console.log('?')
    const user_id = new ObjectId()
    const email_verify_token = await this.signVerifyEmailToken(user_id.toString())
    await databaseService.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        email_verify_token,
        password: hashPassword(payload.password),
        date_of_birth: new Date(payload.date_of_birth)
      })
    )
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id.toString())
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
    )
    await sendVerifyEmail(
      payload.email,
      'Email verify account',
      `<h1>Verify your account</h1> <a href="http://localhost:8080/api/v1/users/verify-email/${email_verify_token}">Verify</a><p>${email_verify_token}</p>`
    )
    console.log('Token verify: ', email_verify_token)
    return {
      access_token,
      refresh_token
    }
  }
  async logout(refresh_token: string) {
    await databaseService.refreshTokens.deleteOne({ token: refresh_token })
    return {
      message: 'Logout success'
    }
  }
  async verifyEmail(userId: string) {
    const [token] = await Promise.all([
      this.signAccessAndRefreshToken(userId),
      databaseService.users.updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            email_verify_token: '',
            verify: UserVerifyStatus.Verified,
            update_at: new Date()
          }
        }
      )
    ])
    const [access_token, refresh_token] = token

    return {
      message: 'Verify success',
      access_token,
      refresh_token
    }
  }
  async getAccount(user_id: string) {
    const user = await databaseService.users.findOne(
      { _id: new ObjectId(user_id) },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    )
    return user
  }
  async checkEmailExist(email: string) {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }
  async resendVerifyEmail(user_id: string) {
    const resend_email_verify_token = await this.signVerifyEmailToken(user_id)
    console.log('Resend email verify: ', resend_email_verify_token)
    const user = await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          email_verify_token: resend_email_verify_token
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    return user
  }
  async forgotPassword(user_id: string, email: string) {
    const forgot_password_token = await this.signForgotPasswordToken(user_id)
    console.log('Forgot password token: ', forgot_password_token)
    const user = await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          forgot_password_token
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    await sendVerifyEmail(email, 'forgot password', `<h1>${forgot_password_token}</h1>`)
    return {
      message: 'Forgot password sent'
    }
  }
}

const usersService = new UsersService()
export default usersService
