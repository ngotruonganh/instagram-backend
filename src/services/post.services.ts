import { ObjectId } from 'mongodb'
import databaseService from '~/services/database.services'
import Post from '~/models/schemas/Post.schema'
import { PostRequestBody } from '~/models/requsets/Post.requests'

class PostService {
  async createPost(user_id: string, body: PostRequestBody) {
    const result = await databaseService.posts.insertOne(
      new Post({
        content: body.content,
        hashtags: [],
        mentions: body.mentions,
        parent_id: body.parent_id,
        user_id: new ObjectId(user_id)
      })
    )
    const tweet = await databaseService.posts.findOne({ _id: result.insertedId })
    return tweet
  }
}

const postService = new PostService()
export default postService
