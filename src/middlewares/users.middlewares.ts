import { NextFunction, Request, Response } from 'express'

export const HomeMiddle = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body)
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({
      error: 'error'
    })
  }
  next()
}

export const LoginValidation = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body)
  const { email, password } = req.body
  if (email !== "1" && password !== '2') {
    return res.status(400).json({
      error: 'error'
    })
  }
  next()
}