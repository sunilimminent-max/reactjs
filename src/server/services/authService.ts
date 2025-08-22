import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserModel } from '@/server/database/repositories/UserModel'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const userModel = new UserModel()

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthResult {
  user: {
    id: number
    name: string
    email: string
    created_at: Date
  }
  token: string
}

export default class AuthService {
  static async register(data: RegisterData): Promise<AuthResult> {
    const { name, email, password } = data

    // Validate input
    if (!name || !email || !password) {
      throw new Error('All fields are required')
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters')
    }

    // Check if user already exists
    const existingUser = await userModel.findByEmail(email)
    if (existingUser) {
      throw new Error('User already exists')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword
    })

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = user
    return {
      user: userWithoutPassword,
      token
    }
  }

  static async login(data: LoginData): Promise<AuthResult> {
    const { email, password } = data

    // Validate input
    if (!email || !password) {
      throw new Error('Email and password are required')
    }

    // Find user
    const user = await userModel.findByEmail(email)
    if (!user) {
      throw new Error('Invalid credentials')
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      throw new Error('Invalid credentials')
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = user
    return {
      user: userWithoutPassword,
      token
    }
  }

  static verifyToken(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET) as { userId: number; email: string }
    } catch (error) {
      throw new Error('Invalid token')
    }
  }

  static async getUserById(userId: number) {
    return userModel.findById(userId)
  }

  static async jwtToken(user: any) {
    return jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
  }
} 