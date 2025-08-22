# Database Setup Guide

This project uses MySQL with Knex.js for database management and migrations.

## Prerequisites

1. **MySQL Server** - Make sure MySQL is installed and running on your system
2. **Node.js** - Version 16 or higher
3. **npm** - For package management

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a MySQL database:
```sql
CREATE DATABASE projectmanagement_dev;
```

3. Set up environment variables:
   - Copy `env.example` to `.env.local`
   - Update the database configuration in `.env.local`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=projectmanagement_dev
JWT_SECRET=your-super-secret-jwt-key
```

## Database Migrations

### Run all migrations
```bash
npm run db:migrate
```

### Rollback last migration
```bash
npm run db:migrate:rollback
```

### Rollback all migrations
```bash
npm run db:migrate:rollback --all
```

### Create a new migration
```bash
npm run db:make:migration migration_name
```

## Database Seeds

### Run all seeds
```bash
npm run db:seed
```

### Create a new seed
```bash
npm run db:make:seed seed_name
```

### Reset database (rollback + migrate + seed)
```bash
npm run db:reset
```

## Database Schema

### Tables

1. **users** - User accounts
   - `id` (Primary Key)
   - `name` (VARCHAR)
   - `email` (VARCHAR, Unique)
   - `password` (VARCHAR, Hashed)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

2. **projects** - Project information
   - `id` (Primary Key)
   - `name` (VARCHAR)
   - `description` (TEXT)
   - `status` (ENUM: active, completed, archived)
   - `owner_id` (Foreign Key to users.id)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

3. **tasks** - Task information
   - `id` (Primary Key)
   - `title` (VARCHAR)
   - `description` (TEXT)
   - `status` (ENUM: pending, in_progress, completed, cancelled)
   - `priority` (ENUM: low, medium, high, urgent)
   - `project_id` (Foreign Key to projects.id)
   - `assigned_to` (Foreign Key to users.id, nullable)
   - `created_by` (Foreign Key to users.id)
   - `due_date` (DATE, nullable)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

4. **project_members** - Many-to-many relationship between users and projects
   - `id` (Primary Key)
   - `project_id` (Foreign Key to projects.id)
   - `user_id` (Foreign Key to users.id)
   - `role` (ENUM: owner, admin, member, viewer)
   - `created_at` (TIMESTAMP)

## Database Repositories

The application uses repository pattern for database operations:

- `UserRepository` - User management
- `ProjectRepository` - Project management
- `TaskRepository` - Task management
- `ProjectMemberRepository` - Project membership management

## Usage Examples

### Using the Database Service

```typescript
import { databaseService } from '@/database/DatabaseService'

// Create a new user
const user = await databaseService.users.create({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'hashedPassword'
})

// Find projects by owner
const projects = await databaseService.projects.findByOwner(user.id)

// Create a task
const task = await databaseService.tasks.create({
  title: 'New Task',
  description: 'Task description',
  project_id: project.id,
  created_by: user.id
})
```

### Using Transactions

```typescript
await databaseService.transaction(async (trx) => {
  // All operations within this callback will be in a transaction
  const user = await databaseService.users.create(userData, trx)
  const project = await databaseService.projects.create(projectData, trx)
  
  // If any operation fails, the entire transaction will be rolled back
})
```

## Initial Data

The seed file creates:
- 3 test users (john@example.com, jane@example.com, bob@example.com)
- 3 sample projects
- Project memberships
- 5 sample tasks

Default password for all test users: `password123`

## Troubleshooting

### Connection Issues
1. Verify MySQL is running
2. Check database credentials in `.env.local`
3. Ensure database exists
4. Check firewall settings

### Migration Issues
1. Check MySQL version compatibility
2. Verify database permissions
3. Check for syntax errors in migration files

### Performance
1. Monitor query performance
2. Add indexes for frequently queried columns
3. Use connection pooling (already configured)

## Production Deployment

1. Use environment-specific database configurations
2. Set strong JWT secrets
3. Enable SSL for database connections
4. Set up database backups
5. Monitor database performance
6. Use connection pooling
7. Implement proper error handling 