import { Response } from 'express';

export class ApiResponse {
  static success<T>(res: Response, data: T, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({ success: true, message, data });
  }

  static error(res: Response, message: string, statusCode = 400, errors: unknown = null) {
    return res.status(statusCode).json({ success: false, message, errors });
  }

  static paginated<T>(
    res: Response,
    data: T[],
    total: number,
    page: number,
    perPage: number,
    message = 'Success'
  ) {
    return res.status(200).json({
      success: true,
      message,
      data,
      meta: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    });
  }
}