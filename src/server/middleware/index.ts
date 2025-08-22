import { NextApiRequest, NextApiResponse } from 'next'
import { UserRole, ROLE_PERMISSIONS } from '../database/types'
import AuthService from '@/server/services/authService'
// Middleware interface
export interface Middleware {
  name: string
  handler: (req: NextApiRequest, res: NextApiResponse, next: () => void) => Promise<void>
}

// Extended request interface with user info
export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    id: number
    email: string
    role: UserRole
    name: string
  }
}

// Authentication middleware
export default class AuthMiddleware {
  static authenticate(roles: any): Middleware {
    return {
      name: 'auth',
      handler: async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
        try {

          const token = req.headers.authorization?.replace('Bearer ', '')
          
          if (!token) {
            return res.status(401).json({
              isSuccess: false,
              error: 'Authentication token required'
            })
          }
          
          // // Here you would verify the JWT token and get user info
          // // For now, we'll simulate user data - replace with actual JWT verification
          const decoded = await AuthService.verifyToken(token);
          
          if (!decoded) {
            return res.status(401).json({
              isSuccess: false,
              error: 'Invalid authentication token'
            })
          }

          const user = await AuthService.getUserById(decoded.userId);

          if (!user) {
            return res.status(401).json({
              isSuccess: false,
              error: 'User not found'
            })
          }

         
          
          if(roles.includes("auth")){
            
            (req as AuthenticatedRequest).user = user;
            next()
          }else if(roles.includes(user.role)){
            (req as AuthenticatedRequest).user = user;
            next()
          }else{
            return res.status(403).json({
              isSuccess: false,
              error: 'Access denied. Required role: ' + user.role
            })
          }
          
        } catch (error) {
          console.error('Authentication error:', error)
          return res.status(401).json({
            isSuccess: false,
            error: 'Authentication failed'
          })
        }
      }
    }
  }

  // Role-based authorization middleware
  static requireRole(requiredRole: UserRole): Middleware {
    return {
      name: 'role',
      handler: async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
        try {
          const authReq = req as AuthenticatedRequest
          const user = authReq.user
          
          if (!user) {
            return res.status(401).json({
              isSuccess: false,
              error: 'Authentication required'
            })
          }

          const hasRole = this.checkRole(user.role, requiredRole)
          
          if (!hasRole) {
            return res.status(403).json({
              isSuccess: false,
              error: `Access denied. Required role: ${requiredRole}`
            })
          }
          
          next()
        } catch (error) {
          console.error('Role authorization error:', error)
          return res.status(403).json({
            isSuccess: false,
            error: 'Authorization failed'
          })
        }
      }
    }
  }

  // Permission-based authorization middleware
  static requirePermission(permission: keyof import('../database/types').RolePermissions): Middleware {
    return {
      name: 'permission',
      handler: async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
        try {
          const authReq = req as AuthenticatedRequest
          const user = authReq.user
          
          if (!user) {
            return res.status(401).json({
              isSuccess: false,
              error: 'Authentication required'
            })
          }

          const userPermissions = ROLE_PERMISSIONS[user.role]
          
          if (!userPermissions[permission as keyof typeof userPermissions]) {
            return res.status(403).json({
              isSuccess: false,
              error: `Access denied. Required permission: ${String(permission)}`
            })
          }
          
          next()
        } catch (error) {
          console.error('Permission authorization error:', error)
          return res.status(403).json({
            isSuccess: false,
            error: 'Authorization failed'
          })
        }
      }
    }
  }

  // Helper method to check if user has required role or higher
  private static checkRole(userRole: UserRole, requiredRole: UserRole): boolean {
    const roleHierarchy: Record<UserRole, number> = {
      'user': 1,
      'manager': 2,
      'admin': 3,
      'super_admin': 4
    }
    
    return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
  }

  // Helper method to verify JWT token
  // private static async verifyToken(token: string): Promise<AuthenticatedRequest['user'] | null> {
  //   const { AuthService } = await import('../services/authService')
  //   return AuthService.verifyToken(token)
  // }
}

// // Export for backward compatibility
// export const authMiddleware = AuthMiddleware.authenticate([])

// // Export role-based middlewares
// export const requireAdmin = AuthMiddleware.requireRole('admin')
// export const requireManager = AuthMiddleware.requireRole('manager')
// export const requireSuperAdmin = AuthMiddleware.requireRole('super_admin')

// // Export permission-based middlewares
// export const requireUserManagement = AuthMiddleware.requirePermission('canManageUsers')
// export const requireProjectManagement = AuthMiddleware.requirePermission('canManageProjects')
// export const requireTaskManagement = AuthMiddleware.requirePermission('canManageTasks')

 