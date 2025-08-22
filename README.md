# Project Management App

A Next.js application with complete authentication system and project management features using route-based API architecture.

test changes

## 🚀 Features

- **User Authentication**: Register, login, and logout functionality
- **JWT Token Authentication**: Secure token-based authentication
- **Protected Routes**: Dashboard and other protected pages
- **Route-Based API**: Direct API calls without React Context
- **Modern UI**: Beautiful Tailwind CSS styling
- **TypeScript**: Full TypeScript support
- **Responsive Design**: Works on all devices

## 📁 Project Structure

```
src/
├── components/
│   ├── LoginForm.tsx              # Login form component
│   └── ProtectedRoute.tsx         # Component to protect routes
├── pages/
│   ├── api/
│   │   ├── login.ts               # Login API endpoint
│   │   ├── register.ts            # Register API endpoint
│   │   ├── logout.ts              # Logout API endpoint
│   │   └── profile.ts             # Protected profile API
│   ├── dashboard.tsx              # Protected dashboard page
│   ├── login.tsx                  # Login page
│   ├── register.tsx               # Register page
│   └── _app.tsx                   # App wrapper
├── services/
│   ├── loginApiService.ts         # Login API service
│   ├── registerApiService.ts      # Register API service
│   ├── logoutApiService.ts        # Logout API service
│   └── authUtils.ts               # Authentication utilities
├── server/
│   ├── models/
│   │   └── LoginModel.ts          # Login data model
│   ├── controllers/
│   │   └── AuthController.ts      # Authentication controller
│   └── services/
│       ├── LoginService.ts        # Login business logic
│       └── authService.ts         # Core authentication service
└── styles/
    └── globals.css                # Global styles
```

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Authentication System

### API Endpoints

- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/profile` - Get user profile (protected)

### Pages

- `/register` - Registration page
- `/login` - Login page
- `/dashboard` - Protected dashboard

### Usage

#### Registration
```typescript
import { RegisterApiService } from '@/services/registerApiService'

const result = await RegisterApiService.register({ name, email, password })
if (result.success) {
  // User registered successfully
}
```

#### Login
```typescript
import { LoginApiService } from '@/services/loginApiService'

const result = await LoginApiService.login({ email, password })
if (result.success) {
  // User logged in successfully
}
```

#### Logout
```typescript
import { LogoutApiService } from '@/services/logoutApiService'

await LogoutApiService.logout()
// User logged out, localStorage cleared
```

#### Authentication Checks
```typescript
import { AuthUtils } from '@/services/authUtils'

if (AuthUtils.isAuthenticated()) {
  // User is authenticated
}

const user = AuthUtils.getCurrentUser()
const token = AuthUtils.getToken()
```

#### Protected Routes
```typescript
import ProtectedRoute from '@/components/ProtectedRoute'

export default function MyPage() {
  return (
    <ProtectedRoute>
      <div>This content is protected</div>
    </ProtectedRoute>
  )
}
```

## 🎨 Styling

This project uses **Tailwind CSS** for styling. The design is modern, responsive, and follows best practices.

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
JWT_SECRET=your-secret-key-here
```

### Customization

- **User Storage**: Replace the in-memory storage with a real database
- **Styling**: Modify `src/styles/globals.css` for custom styles
- **API Routes**: Add new endpoints in `src/pages/api/`
- **Services**: Add business logic in `src/services/`

## 🚀 Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Start the production server:**
   ```bash
   npm start
   ```

## 📝 Notes

- The current implementation uses in-memory storage for demo purposes
- In production, replace with a real database (PostgreSQL, MongoDB, etc.)
- JWT tokens expire after 7 days
- Passwords are hashed using bcrypt
- All API endpoints include proper error handling
- Authentication state is managed through localStorage
- No React Context dependency - uses direct API calls

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
