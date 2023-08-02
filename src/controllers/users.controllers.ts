import { Request, Response } from 'express'

export const Home = (req: Request, res: Response) => {
  res.json({
    message: 'Login success'
  })
}
