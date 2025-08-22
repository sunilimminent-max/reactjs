# Login Functionality MVC Architecture - Route-Based API

This document explains how the login functionality has been refactored to follow the MVC (Model-View-Controller) pattern using a route-based API approach without React Context.

## Architecture Overview

The login functionality is now structured with clear separation of concerns using direct API calls:

### Model Layer
- **`LoginModel`** (`src/server/models/LoginModel.ts`): Defines the data structure and validation rules for login data
- **`LoginModelValidator`**: Handles data validation and sanitization

### View Layer
- **`LoginForm`** (`src/components/LoginForm.tsx`): Pure presentation component that handles UI rendering
- **`login.tsx`** (`src/pages/login.tsx`): Page component that acts as a view controller

### Controller Layer
- **`AuthController`** (`src/server/controllers/AuthController.ts`): Handles HTTP requests and coordinates between services
- **`LoginService`** (`src/server/services/LoginService.ts`): Contains business logic for login operations

### Service Layer
- **`AuthService`** (`src/server/services/authService.ts`): Core authentication service that handles user authentication
- **`LoginApiService`** (`src/services/loginApiService.ts`): Client-side API service for login operations
- **`LogoutApiService`** (`src/services/logoutApiService.ts`): Client-side API service for logout operations
- **`AuthUtils`** (`src/services/authUtils.ts`): Utility functions for authentication checks

## Data Flow

1. **User Input**: User enters email and password in the LoginForm component
2. **View Controller**: The login page component receives the form submission
3. **API Service**: LoginApiService makes a direct API call to `/api/login`
4. **Controller**: AuthController receives the request and validates the method
5. **Service Layer**: LoginService handles validation and business logic
6. **Model Validation**: LoginModelValidator validates and sanitizes the data
7. **Authentication**: AuthService performs the actual authentication
8. **Response**: The result flows back through the layers to the UI
9. **Storage**: Authentication data is stored in localStorage

## Key Improvements

### 1. Route-Based API Approach
- **No Context Dependency**: Removed React Context in favor of direct API calls
- **Direct API Services**: LoginApiService and LogoutApiService handle API communication
- **localStorage Management**: Authentication state is managed through localStorage
- **Utility Functions**: AuthUtils provides common authentication utilities

### 2. Enhanced Validation
- Email format validation
- Input sanitization (trim, lowercase)
- Comprehensive error handling

### 3. Better User Experience
- Removed alert() in favor of inline success/error messages
- Loading states with spinner
- Disabled form inputs during submission
- Smooth redirect after successful login

### 4. Type Safety
- Strong TypeScript interfaces for all data structures
- Proper error handling with typed results

## File Structure

```
src/
├── components/
│   ├── LoginForm.tsx          # View component
│   └── ProtectedRoute.tsx     # Route protection component
├── pages/
│   ├── login.tsx              # View controller
│   ├── dashboard.tsx          # Protected dashboard page
│   └── api/
│       ├── login.ts           # Login API endpoint
│       └── logout.ts          # Logout API endpoint
├── services/
│   ├── loginApiService.ts     # Client-side login API service
│   ├── logoutApiService.ts    # Client-side logout API service
│   └── authUtils.ts           # Authentication utilities
└── server/
    ├── models/
    │   └── LoginModel.ts      # Data model and validation
    ├── controllers/
    │   └── AuthController.ts  # Request controller
    └── services/
        ├── LoginService.ts    # Business logic
        └── authService.ts     # Core auth service
```

## API Endpoints

### POST /api/login
- **Purpose**: Authenticate user and return JWT token
- **Request Body**: `{ email: string, password: string }`
- **Response**: `{ success: boolean, user?: User, token?: string, error?: string }`

### POST /api/logout
- **Purpose**: Logout user (server-side cleanup)
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ success: boolean, message?: string, error?: string }`

## Authentication Flow

### Login Process
1. User submits login form
2. LoginApiService calls `/api/login`
3. Server validates credentials and returns JWT token
4. Client stores token and user data in localStorage
5. User is redirected to dashboard

### Logout Process
1. User clicks logout button
2. LogoutApiService calls `/api/logout`
3. Client clears localStorage
4. User is redirected to login page

### Route Protection
1. ProtectedRoute component checks authentication on mount
2. Uses AuthUtils to validate token and check localStorage
3. Redirects to login if not authenticated
4. Shows loading state during authentication check

## Benefits

1. **No Context Dependency**: Simpler architecture without React Context complexity
2. **Direct API Control**: Full control over API calls and error handling
3. **Better Performance**: No context re-renders affecting other components
4. **Easier Testing**: Services can be tested independently
5. **Flexible State Management**: localStorage provides persistent state
6. **Type Safety**: Strong TypeScript support throughout the stack

## Usage Example

```typescript
// Login
const result = await LoginApiService.login({ email, password })
if (result.success) {
  // User is logged in, token stored in localStorage
  router.push('/dashboard')
}

// Check authentication
if (AuthUtils.isAuthenticated()) {
  // User is authenticated
}

// Logout
await LogoutApiService.logout()
// User is logged out, localStorage cleared
``` 