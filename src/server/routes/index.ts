import { NextApiRequest, NextApiResponse } from 'next'
import { AuthController } from '../controllers/AuthController'
import { PageController } from '../controllers/PageController'
import AuthMiddleware from '../middleware'
import AuthService from '@/server/services/authService'

export interface Route {
  path: string
  method: string
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
  middleware?: string[]
}

export class Router {
  private routes: Route[] = []

  // Auth routes
  private authRoutes = [
    { path: '/api/auth/register', method: 'POST', handler: 'register' },
    { path: '/api/auth/login', method: 'POST', handler: 'login' },
    { path: '/api/auth/logout', method: 'POST', handler: 'logout' },
    { path: '/api/auth/user', method: 'GET', handler: 'getUser', middleware: ['auth', 'super_admin'] },
    { path: '/api/auth/profile', method: 'GET', handler: 'getProfile', middleware: ['auth'] },
    { path: '/api/auth/profile', method: 'PUT', handler: 'updateProfile', middleware: ['auth'] },
    { path: '/api/auth/profile', method: 'PATCH', handler: 'updateProfile', middleware: ['auth'] }
  ]

  // Page routes
  private pageRoutes = [
    { path: '/api/pages', method: 'GET', handler: 'getPages', middleware: ['auth'] },
    { path: '/api/pages', method: 'POST', handler: 'createPage', middleware: ['auth'] },
    { path: '/api/pages/[id]', method: 'GET', handler: 'getPage' },
    { path: '/api/pages/[id]', method: 'PUT', handler: 'updatePage', middleware: ['auth'] },
    { path: '/api/pages/[id]', method: 'PATCH', handler: 'updatePage', middleware: ['auth'] },
    { path: '/api/pages/[id]', method: 'DELETE', handler: 'deletePage', middleware: ['auth'] },
    { path: '/api/pages/[slug]', method: 'GET', handler: 'getPage' }
  ]

  constructor() {
    this.registerRoutes()
  }

  private registerRoutes(): void {
    // Register auth routes
    this.authRoutes.forEach(route => {
      this.routes.push({
        path: route.path,
        method: route.method,
        middleware: route.middleware,
        handler: async (req: NextApiRequest, res: NextApiResponse) => {
          const controller = new AuthController(req, res)
          await (controller as any)[route.handler]()
        }
      })
    })

    // Register page routes
    this.pageRoutes.forEach(route => {
      this.routes.push({
        path: route.path,
        method: route.method,
        middleware: route.middleware,
        handler: async (req: NextApiRequest, res: NextApiResponse) => {
          const controller = new PageController(req, res)
          await (controller as any)[route.handler]()
        }
      })
    })
  }

  public async handleRequest(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const { method, url } = req
    const path = url || ''

    // Find matching route
    const route = this.findRoute(path, method || 'GET')
    
    if (route) {
      try {
        if (route.middleware) {
          await AuthMiddleware.authenticate(route.middleware as any).handler(req, res, () => {
            return route.handler(req, res)
          })
        }else{
          await route.handler(req, res)
        }
      } catch (error) {
        console.error('Route handler error:', error)
        res.status(500).json({
          isSuccess: false,
          message: 'Internal server error'
        })
      }
    } else {
      res.status(404).json({
        isSuccess: false,
        message: 'Route not found'
      })
    }
  }

  private async applyMiddleware(middlewareNames: string[], req: NextApiRequest, res: NextApiResponse): Promise<void> {
    for (const middlewareName of middlewareNames) {
      switch (middlewareName) {
        case 'auth':
          await AuthMiddleware.authenticate([middlewareName]).handler(req, res, () => {})
          break
        default:
          console.warn(`Unknown middleware: ${middlewareName}`)
      }
    }
  }

  private findRoute(path: string, method: string): Route | undefined {
    return this.routes.find(route => {
      const pathMatches = this.matchPath(route.path, path)
      const methodMatches = route.method === method
      return pathMatches && methodMatches
    })
  }

  private matchPath(routePath: string, requestPath: string): boolean {
    // Convert route path to regex pattern
    const pattern = routePath
      .replace(/\[([^\]]+)\]/g, '([^/]+)') // Replace [param] with regex group
      .replace(/\//g, '\\/') // Escape forward slashes
    
    const regex = new RegExp(`^${pattern}$`)
    return regex.test(requestPath)
  }

  public getRoutes(): Route[] {
    return this.routes
  }
}

// Export singleton instance
export const router = new Router() 