import { AuthService, LoginData } from './authService'
import { LoginModel, LoginModelValidator } from '../models/LoginModel'

export interface LoginValidationResult {
  isValid: boolean
  errors: string[]
}

export interface LoginResult {
  success: boolean
  user?: any
  token?: string
  error?: string
}

export class LoginService {
  /**
   * Validates login form data
   */
  static validateLoginData(data: LoginData): LoginValidationResult {
    const loginModel = LoginModelValidator.create(data)
    const validation = LoginModelValidator.validate(loginModel)
    
    return {
      isValid: validation.isValid,
      errors: validation.errors
    }
  }

  /**
   * Performs login with validation
   */
  static async performLogin(data: LoginData): Promise<LoginResult> {
    try {

      const loginData: LoginData = {
        email: data.email,
        password: data.password
      }

      // Attempt login through AuthService
      const authResult = await AuthService.login(loginData)

      let dataResult = {
        user: authResult.user,
        token: authResult.token
      }
      
      return {
        isSuccess: true,
        message: 'Login successful',
        data: dataResult
      }
    } catch (error) {
      return {
        isSuccess: false,
        message: error instanceof Error ? error.message : 'Login failed'
      }
    }
  }

  /**
   * Sanitizes login data
   */
  static sanitizeLoginData(data: LoginData): LoginData {
    const loginModel = LoginModelValidator.create(data)
    const sanitizedModel = LoginModelValidator.sanitize(loginModel)
    
    return {
      email: sanitizedModel.email,
      password: sanitizedModel.password
    }
  }
} 