import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import userServices from '~/services/user.services'
import databaseService from '~/services/database.services'
import { hashPassword } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import { ErrorWithStatus } from '~/models/Error'

export const loginValidator = validate(
  checkSchema({
      email: {
        notEmpty: true,
        isEmail: true,
        trim: true,
        errorMessage: 'email can not empty',
        custom: {
          options: async (value, { req }) => {
            const user = await databaseService.users.findOne({
              email: value,
              password: hashPassword(req.body.password)
            })
            if (user === null) {
              throw new ErrorWithStatus({ message: 'User not found', status: 400 })
            }
            req.user = user
            return true
          }
        }
      },
      password: {
        notEmpty: true,
        isString: true,
        errorMessage: 'Password can not empty'
      }
    },
    ['body'])
)

export const registerValidator = validate(
  checkSchema({
      name: {
        notEmpty: true,
        isString: true,
        isLength: {
          options: {
            min: 1,
            max: 100
          }
        },
        trim: true
      },
      email: {
        notEmpty: true,
        isEmail: true,
        trim: true,
        custom: {
          options: async (value) => {
            const result = await userServices.checkEmailExist(value)
            if (result) {
              throw new ErrorWithStatus({ message: 'Email is exists', status: 401 })
            }
            return true
          }
        }
      },
      password: {
        notEmpty: true,
        isString: true,
        isLength: {
          options: {
            min: 6,
            max: 50
          }
        },
        isStrongPassword: {
          options: {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
          },
          errorMessage:
            'Password must be at least 6 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol'
        }
      },
      confirm_password: {
        notEmpty: true,
        isString: true,
        isLength: {
          options: {
            min: 6,
            max: 50
          }
        },
        isStrongPassword: {
          options: {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
          },
          errorMessage:
            'Password must be at least 6 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol'
        },
        custom: {
          options: (value, { req }) => {
            if (value !== req.body.password) {
              throw new ErrorWithStatus({message: 'Password confirmation does not match password', status: 401})
            }
            return true
          }
        }
      },
      date_of_birth: {
        isISO8601: {
          options: {
            strict: true,
            strictSeparator: true
          }
        }
      }
    },
    ['body'])
)

export const accessTokenValidator = validate(
  checkSchema({
    Authorization: {
      notEmpty: {
        errorMessage: 'access token empty'
      },
      custom: {
        options: async (value: string, { req }) => {
          const access_token = value.split(' ')[1]
            console.log(access_token)
          if (!access_token) {
            throw new Error('error')
          }
          const decoded_authorization = await verifyToken({ token: access_token })
          req.decoded_authorization = decoded_authorization
          return true
        }
      }
    }
  },
    ['headers'])
)

export const refreshTokenValidator = validate(
  checkSchema({
    refresh_token: {
      notEmpty: {
        errorMessage: 'can not empty'
      },
      custom: {
        options: async (value: string, { req }) => {
          try {
            const [decoded_refresh_token, refresh_token] = await Promise.all([
              verifyToken({ token: value }),
              databaseService.refreshTokens.findOne({ token: value })
            ])
            if(refresh_token === null ) {
              throw new Error("Error")
            }
            req.decoded_refresh_token = decoded_refresh_token
          } catch (error) {
            throw new Error('loi refresh')
          }
        }
      }
    }
  }, ['body'])
)
