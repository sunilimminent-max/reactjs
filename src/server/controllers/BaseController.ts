import { NextApiRequest, NextApiResponse } from 'next'
import AuthService from '../services/authService'

export interface ApiResponse<T = any> {
  isSuccess: boolean
  data?: T
  error?: string
  message?: string
}

export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    id: number
    email: string
  }
}

export abstract class BaseController {
  protected req: NextApiRequest
  protected res: NextApiResponse

  constructor(req: NextApiRequest, res: NextApiResponse) {
    this.req = req
    this.res = res
  }

  protected success<T>(data: T, message?: string, statusCode: number = 200): void {
    const response: ApiResponse<T> = {
      isSuccess: true,
      data,
      message
    }
    this.res.status(statusCode).json(response)
  }

  protected error(message: string, statusCode: number = 400): void {
    const response: ApiResponse = {
      isSuccess: false,
      message: message
    }
    this.res.status(statusCode).json(response)
  }

  protected async authenticate(): Promise<AuthenticatedRequest> {
    const authHeader = this.req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('No token provided')
    }

    const token = authHeader.substring(7)
    const decoded = AuthService.verifyToken(token)
    
    const user = await AuthService.getUserById(decoded.userId)
    if (!user) {
      throw new Error('User not found')
    }

    (this.req as AuthenticatedRequest).user = {
      id: user.id,
      email: user.email
    }

    return this.req as AuthenticatedRequest
  }

  protected getAuthenticatedUser(): { id: number; email: string } {
    const authReq = this.req as AuthenticatedRequest
    if (!authReq.user) {
      throw new Error('User not authenticated')
    }
    return authReq.user
  }

  protected validateMethod(allowedMethods: string[]): void {
    if (!allowedMethods.includes(this.req.method || '')) {
      this.error(`Method ${this.req.method} not allowed`, 405)
      return
    }
  }

  protected getBody<T>(): T {
    return this.req.body as T
  }
  protected getFiles(): any {
    return this.req.files
  }

  protected getQuery<T>(): T {
    return this.req.query as T
  }

  protected getParams(): Record<string, string> {
    return this.req.query as Record<string, string>
  }

  protected getParam(key: string): string | undefined {
    return this.req.query[key] as string
  }

  protected getHeader(key: string): string | undefined {
    return this.req.headers[key] as string
  }
} 