import bcrypt from 'bcryptjs'
import { AuthenticatedRequest, BaseController } from './BaseController'
import { UserModel } from '@/server/database/repositories/UserModel'
import AuthService  from '@/server/services/authService'

const userModel = new UserModel()

export class AuthController extends BaseController {
  async register(): Promise<void> {
    try {
      this.validateMethod(['POST'])

      const data = this.getBody<{ name: string; email: string; password: string }>()
      
      
      if (!data.name || !data.email || !data.password) {
        return this.error('All fields are required')
      }

      const result = await userModel.create(data)
      this.success(result, 'User registered successfully', 201)
    } catch (error) {
      console.error('Registration error:', error)
      const message = error instanceof Error ? error.message : 'Registration failed'
      this.error(message, 400)
    }
  }

  async login(): Promise<void> {
    try {
      
      this.validateMethod(['POST'])

      const { email, password } = this.getBody<{ email: string; password: string }>()

      if (!email || !password) {
        this.error('Email and password are required', 401)
        return
      }
      const user = await userModel.findByEmail(email)
      if (!user) {
        this.error('Invalid credentials', 401)
        return
      }


      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        this.error('Password is incorrect', 401)
        return
      }

      const token = await AuthService.jwtToken(user);

      this.success({ user, token }, 'Login successful')
      
    } catch (error) {
      console.error('Login error:', error)
      const message = error instanceof Error ? error.message : 'Login failed'
      this.error(message, 401)
    }
  }

  async getUser(): Promise<void> {
    try {

      this.validateMethod(['GET'])
      const user = (this.req as AuthenticatedRequest).user
      
      if (!user) {
        return this.error('User not authenticated', 401)
      }
      
      // const userData = await AuthService.getUserById(user.id)
      // if (!userData) {
      //   return this.error('User not found', 404)
      // }
      

      this.success({user}, 'Profile retrieved successfully',200)
    } catch (error) {
      console.error('Get profile error:', error)
      const message = error instanceof Error ? error.message : 'Failed to get profile'
      this.error(message, 401)
    }
  }

  async updateProfile(): Promise<void> {
    try {
      this.validateMethod(['PUT', 'PATCH'])
      
      await this.authenticate()
      const user = this.getAuthenticatedUser()
      
      const updateData = this.getBody<{ name?: string; email?: string; password?: string }>()
      
      // TODO: Implement profile update logic
      this.success({ message: 'Profile update not implemented yet' }, 'Profile update endpoint ready')
    } catch (error) {
      console.error('Update profile error:', error)
      const message = error instanceof Error ? error.message : 'Failed to update profile'
      this.error(message, 400)
    }
  }

  async logout(): Promise<void> {
    try {
      this.validateMethod(['POST'])
      this.success({ message: 'Logout successful' }, 'Logout successful')
    } catch (error) {
      console.error('Logout error:', error)
      const message = error instanceof Error ? error.message : 'Failed to logout'
      this.error(message, 400)
    }
  }
} 