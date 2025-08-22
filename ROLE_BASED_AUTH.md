# Role-Based Authentication System

This project implements a comprehensive role-based authentication system with the following features:

## User Roles

The system supports four user roles with hierarchical permissions:

1. **user** (Level 1) - Basic user with limited permissions
2. **manager** (Level 2) - Can manage projects and tasks
3. **admin** (Level 3) - Can manage users, projects, and tasks
4. **super_admin** (Level 4) - Full system access including deletion permissions

## Role Permissions

Each role has specific permissions:

### Super Admin
- ✅ Manage users
- ✅ Manage projects
- ✅ Manage tasks
- ✅ View all projects
- ✅ Delete projects
- ✅ Assign tasks
- ✅ Delete tasks

### Admin
- ✅ Manage users
- ✅ Manage projects
- ✅ Manage tasks
- ✅ View all projects
- ❌ Delete projects
- ✅ Assign tasks
- ✅ Delete tasks

### Manager
- ❌ Manage users
- ✅ Manage projects
- ✅ Manage tasks
- ✅ View all projects
- ❌ Delete projects
- ✅ Assign tasks
- ❌ Delete tasks

### User
- ❌ Manage users
- ❌ Manage projects
- ❌ Manage tasks
- ❌ View all projects
- ❌ Delete projects
- ❌ Assign tasks
- ❌ Delete tasks

## Usage Examples

### 1. Route Protection with Role-Based Middleware

```typescript
// In routes/index.ts
private adminRoutes = [
  { 
    path: '/api/admin/users', 
    method: 'GET', 
    handler: 'getAllUsers', 
    middleware: ['auth', 'admin'] 
  }
]
```

### 2. Permission-Based Middleware

```typescript
// Protect routes with specific permissions
private projectRoutes = [
  { 
    path: '/api/projects', 
    method: 'POST', 
    handler: 'createProject', 
    middleware: ['auth', 'project_management'] 
  }
]
```

### 3. Controller-Level Authorization

```typescript
// In your controller
async createProject(req: AuthenticatedRequest, res: NextApiResponse) {
  const user = req.user!
  
  // Check if user has permission to create projects
  if (!AuthService.hasPermission(user.role, 'canManageProjects')) {
    return res.status(403).json({
      isSuccess: false,
      error: 'Insufficient permissions'
    })
  }
  
  // Continue with project creation
}
```

### 4. Resource-Level Authorization

```typescript
// Check if user can access specific resource
async updateProject(req: AuthenticatedRequest, res: NextApiResponse) {
  const user = req.user!
  const projectId = req.query.id as string
  const project = await projectRepository.findById(projectId)
  
  // Check if user owns the project or has admin access
  if (!AuthService.canAccessResource(user, project.owner_id, 'manager')) {
    return res.status(403).json({
      isSuccess: false,
      error: 'Access denied'
    })
  }
  
  // Continue with project update
}
```

## Middleware Types

### 1. Authentication Middleware
```typescript
import { authMiddleware } from '../middleware'
// Ensures user is authenticated
```

### 2. Role-Based Middleware
```typescript
import { requireAdmin, requireManager, requireSuperAdmin } from '../middleware'
// Ensures user has specific role or higher
```

### 3. Permission-Based Middleware
```typescript
import { requireUserManagement, requireProjectManagement, requireTaskManagement } from '../middleware'
// Ensures user has specific permission
```

## JWT Token Structure

The JWT token includes user role information:

```json
{
  "id": 1,
  "email": "user@example.com",
  "role": "admin",
  "name": "John Doe",
  "iat": 1234567890,
  "exp": 1234654290
}
```

## Database Schema

The users table includes a role field:

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'manager', 'super_admin', 'user') DEFAULT 'user' NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Security Features

1. **Role Hierarchy**: Higher roles inherit permissions from lower roles
2. **Resource Ownership**: Users can only access resources they own (unless they have admin access)
3. **JWT Token Verification**: Secure token-based authentication
4. **Permission Granularity**: Fine-grained permission control
5. **Middleware Chain**: Multiple middleware can be applied to a single route

## Best Practices

1. Always use middleware for route protection
2. Implement resource-level authorization in controllers
3. Use permission-based checks for fine-grained control
4. Validate user ownership for sensitive operations
5. Log authentication and authorization events
6. Use environment variables for JWT secrets
7. Implement proper error handling for auth failures 