import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'

class UsersService {
  async register(payload: { name: string, email: string; password: string }) {
    const { name, email, password} = payload
    const result = await databaseService.users.insertOne(
      new User({
        name,
        email,
        password,
      })
    )
    return result
  }
  async checkEmailExist(email: string) {
      const user = await databaseService.users.findOne({email})
      return Boolean(user)
  }
}

const usersService = new UsersService()
export default usersService