import { NextApiRequest, NextApiResponse } from 'next'
import { AuthService } from '@/server/services/authService'

export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    userId: number
    email: string
  }
}

export function withAuth(
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '')
      
      if (!token) {
        return res.status(401).json({ error: 'No token provided' })
      }

      const decoded = AuthService.verifyToken(token)
      req.user = decoded
      
      return handler(req, res)
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' })
    }
  }
}

export function getAuthToken(req: NextApiRequest): string | null {
  return req.headers.authorization?.replace('Bearer ', '') || null
} 