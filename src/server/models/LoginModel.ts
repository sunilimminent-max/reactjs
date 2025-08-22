export interface LoginModel {
  email: string
  password: string
}

export class LoginModelValidator {
  private static emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  /**
   * Validates login model data
   */
  static validate(model: LoginModel): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Email validation
    if (!model.email) {
      errors.push('Email is required')
    } else if (!this.emailRegex.test(model.email)) {
      errors.push('Please enter a valid email address')
    }

    // Password validation
    if (!model.password) {
      errors.push('Password is required')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Sanitizes login model data
   */
  static sanitize(model: LoginModel): LoginModel {
    return {
      email: model.email.trim().toLowerCase(),
      password: model.password
    }
  }

  /**
   * Creates a login model from raw data
   */
  static create(data: any): LoginModel {
    return {
      email: data.email || '',
      password: data.password || ''
    }
  }
} 