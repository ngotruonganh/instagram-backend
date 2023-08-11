import { Request, Response, NextFunction } from 'express'
import httpStatus from '~/constants/httpStatus'

export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).json(err)
}
