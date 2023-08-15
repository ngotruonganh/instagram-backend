import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TokenPayload } from '~/models/requsets/User.requests'
import postService from '~/services/post.services'
export const createPostController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await postService.createPost(user_id, req.body)
  return res.json({
    message: 'Create Tweet Successfully',
    result: result
  })
}
