import { NextFunction, Request, Response } from 'express';
export const asyncHandler = (fn: any) => async (req: Request, res: Response, next: NextFunction) => {
    await fn(req, res).catch(next);
};