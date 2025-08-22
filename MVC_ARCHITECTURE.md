# MVC Architecture Implementation

This project now implements a complete Model-View-Controller (MVC) architecture for the backend API. The structure provides clean separation of concerns, maintainable code, and scalable routing.

## Architecture Overview

```
src/server/
├── controllers/          # Controllers (Handle HTTP requests/responses)
│   ├── BaseController.ts
│   ├── AuthController.ts
│   ├── ProjectController.ts
│   └── TaskController.ts
├── services/            # Business Logic Layer
│   ├── authService.ts
│   ├── ProjectService.ts
│   └── TaskService.ts
├── database/           # Data Access Layer (Models)
│   ├── repositories/   # Repository Pattern
│   ├── types.ts        # TypeScript interfaces
│   └── connection.ts   # Database connection
├── routes/             # Routing Layer
│   └── index.ts        # Main router
└── middleware/         # Middleware
    └── authMiddleware.ts
```

## Components

### 1. Controllers (C in MVC)
Controllers handle HTTP requests and responses. They:
- Validate input data
- Authenticate users
- Call appropriate services
- Format responses

**BaseController**: Provides common functionality for all controllers:
- Authentication helpers
- Response formatting
- Error handling
- Input validation

**Specific Controllers**:
- `AuthController`: User authentication and profile management
- `ProjectController`: Project CRUD operations and member management
- `TaskController`: Task CRUD operations and assignment

### 2. Services (Business Logic Layer)
Services contain the business logic and orchestrate data operations:
- `AuthService`: Authentication and user management
- `ProjectService`: Project business logic and member management
- `TaskService`: Task business logic and assignment rules

### 3. Models (M in MVC)
Models represent data structures and database operations:
- **Repositories**: Data access layer using Repository pattern
- **Types**: TypeScript interfaces for type safety
- **Database**: Knex.js for database operations

## API Endpoints

### Authentication Routes
```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - User login
GET    /api/auth/profile      - Get user profile
PUT    /api/auth/profile      - Update user profile
PATCH  /api/auth/profile      - Update user profile
```

### Project Routes
```
POST   /api/projects                    - Create new project
GET    /api/projects                    - Get user's projects
GET    /api/projects/[id]              - Get specific project
PUT    /api/projects/[id]              - Update project
PATCH  /api/projects/[id]              - Update project
DELETE /api/projects/[id]              - Delete project
POST   /api/projects/[id]/members      - Add project member
GET    /api/projects/[id]/members      - Get project members
DELETE /api/projects/[id]/members/[userId] - Remove project member
```

### Task Routes
```
POST   /api/tasks                      - Create new task
GET    /api/tasks                      - Get user's tasks
GET    /api/tasks/[id]                 - Get specific task
PUT    /api/tasks/[id]                 - Update task
PATCH  /api/tasks/[id]                 - Update task
DELETE /api/tasks/[id]                 - Delete task
POST   /api/tasks/[id]/assign          - Assign task to user
GET    /api/projects/[projectId]/tasks - Get project tasks
GET    /api/tasks/status/[status]      - Get tasks by status
```

## Usage Examples

### Creating a New Controller

1. Extend the BaseController:
```typescript
import { BaseController } from './BaseController'

export class MyController extends BaseController {
  async myMethod(): Promise<void> {
    try {
      this.validateMethod(['POST'])
      await this.authenticate()
      
      const data = this.getBody<MyDataType>()
      // Your logic here
      
      this.success(result, 'Operation successful')
    } catch (error) {
      this.error(error.message, 400)
    }
  }
}
```

2. Add route to the router:
```typescript
// In src/server/routes/index.ts
private myRoutes = [
  { path: '/api/my-endpoint', method: 'POST', handler: 'myMethod' }
]
```

### Adding a New Service

```typescript
export class MyService {
  private myRepository = new MyRepository()

  async myBusinessLogic(data: MyInput): Promise<MyOutput> {
    // Validate input
    if (!data.requiredField) {
      throw new Error('Required field missing')
    }

    // Business logic here
    const result = await this.myRepository.create(data)
    
    return result
  }
}
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

The BaseController provides authentication helpers:
- `authenticate()`: Validates JWT token and sets user context
- `getAuthenticatedUser()`: Returns the authenticated user

## Response Format

All API responses follow a consistent format:

**Success Response**:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response**:
```json
{
  "success": false,
  "error": "Error message"
}
```

## Error Handling

The MVC architecture provides centralized error handling:
- Controllers catch and format errors
- Services throw meaningful error messages
- BaseController provides error response formatting

## Benefits of This Architecture

1. **Separation of Concerns**: Clear boundaries between layers
2. **Maintainability**: Easy to modify and extend
3. **Testability**: Each layer can be tested independently
4. **Scalability**: Easy to add new features and endpoints
5. **Type Safety**: Full TypeScript support throughout
6. **Consistency**: Standardized response formats and error handling

## Migration from Old Structure

The old API routes have been updated to use the new MVC structure:
- `/api/login` → Uses `AuthController`
- `/api/register` → Uses `AuthController`
- `/api/profile` → Uses `AuthController`

New endpoints are automatically routed through the MVC system via `/api/[...path].ts`.

## Next Steps

1. Add more controllers for additional features
2. Implement caching layer in services
3. Add request validation middleware
4. Implement rate limiting
5. Add comprehensive logging
6. Create API documentation with OpenAPI/Swagger 