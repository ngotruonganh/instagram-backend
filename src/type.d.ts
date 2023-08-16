import User from '~/models/schemas/User.schema'
import { TokenPayload } from '~/models/requsets/User.requests'

declare module 'express' {
  interface Request {
    user?: User
    decoded_authorization?: TokenPayload
    decoded_email_verify_token?: TokenPayload
  }
}
