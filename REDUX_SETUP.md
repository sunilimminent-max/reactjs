# Redux Setup for Project Management App

This document explains the Redux setup and how to use it in your Next.js project management application.

## Overview

The Redux store is configured with Redux Toolkit and includes the following slices:

- **Auth Slice**: Manages user authentication state
- **Project Slice**: Manages project data and operations
- **Task Slice**: Manages task data and operations
- **UI Slice**: Manages UI state (theme, notifications, modals, etc.)

## File Structure

```
src/store/
├── index.ts              # Main store configuration
├── hooks.ts              # Typed Redux hooks
└── slices/
    ├── authSlice.ts      # Authentication state management
    ├── projectSlice.ts   # Project state management
    ├── taskSlice.ts      # Task state management
    └── uiSlice.ts        # UI state management
```

## Usage

### 1. Using Redux Hooks

Import the typed hooks in your components:

```typescript
import { useAppDispatch, useAppSelector } from '../store/hooks';
```

### 2. Dispatching Actions

```typescript
const dispatch = useAppDispatch();

// Login user
dispatch(loginUser({ email: 'user@example.com', password: 'password' }));

// Create project
dispatch(createProject({ name: 'New Project', description: 'Project description' }));

// Add notification
dispatch(addNotification({ type: 'success', message: 'Operation successful!' }));
```

### 3. Accessing State

```typescript
// Get authentication state
const { user, isAuthenticated, loading } = useAppSelector(state => state.auth);

// Get projects
const { projects, currentProject } = useAppSelector(state => state.projects);

// Get tasks
const { tasks, currentTask } = useAppSelector(state => state.tasks);

// Get UI state
const { theme, notifications, sidebarOpen } = useAppSelector(state => state.ui);
```

## Available Actions

### Auth Actions
- `loginUser(credentials)` - Login with email and password
- `registerUser(userData)` - Register new user
- `logoutUser()` - Logout user
- `fetchCurrentUser()` - Fetch current user data
- `clearError()` - Clear authentication errors

### Project Actions
- `fetchProjects()` - Fetch all projects
- `createProject(projectData)` - Create new project
- `updateProject({ id, projectData })` - Update existing project
- `deleteProject(id)` - Delete project
- `fetchProjectById(id)` - Fetch specific project
- `setCurrentProject(project)` - Set current project
- `clearCurrentProject()` - Clear current project

### Task Actions
- `fetchTasks(projectId?)` - Fetch tasks (optionally filtered by project)
- `createTask(taskData)` - Create new task
- `updateTask({ id, taskData })` - Update existing task
- `deleteTask(id)` - Delete task
- `fetchTaskById(id)` - Fetch specific task
- `updateTaskStatus({ id, status })` - Update task status
- `setCurrentTask(task)` - Set current task
- `clearCurrentTask()` - Clear current task

### UI Actions
- `toggleTheme()` - Toggle between light/dark theme
- `setTheme(theme)` - Set specific theme
- `toggleSidebar()` - Toggle sidebar visibility
- `setSidebarOpen(open)` - Set sidebar open/closed
- `addNotification(notification)` - Add notification
- `removeNotification(id)` - Remove notification
- `clearNotifications()` - Clear all notifications
- `openModal({ id, data })` - Open modal
- `closeModal(id)` - Close modal
- `setLoading(loading)` - Set global loading state

## Example Component

See `src/components/ReduxExample.tsx` for a complete example of how to use Redux in your components.

## API Integration

All async actions (thunks) are configured to work with your existing API endpoints:

- Authentication: `/api/auth/*`
- Projects: `/api/projects/*`
- Tasks: `/api/tasks/*`

The actions automatically handle:
- Authentication headers
- Error handling
- Loading states
- Token management

## State Persistence

- Authentication token is stored in localStorage
- Theme preference is stored in localStorage
- Other state is managed in memory (can be extended with redux-persist if needed)

## TypeScript Support

The store is fully typed with TypeScript. Use the `useAppDispatch` and `useAppSelector` hooks for the best TypeScript experience.

## Best Practices

1. **Use typed hooks**: Always use `useAppDispatch` and `useAppSelector` instead of the plain Redux hooks
2. **Handle loading states**: Check loading states before rendering data
3. **Error handling**: Always handle errors from async actions
4. **Cleanup**: Clear errors and reset state when components unmount
5. **Optimization**: Use selectors to avoid unnecessary re-renders

## Adding New Slices

To add a new slice:

1. Create a new file in `src/store/slices/`
2. Define the slice with `createSlice`
3. Add the reducer to the store in `src/store/index.ts`
4. Export actions and selectors
5. Update TypeScript types if needed

Example:

```typescript
// src/store/slices/newSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const newSlice = createSlice({
  name: 'new',
  initialState: { /* initial state */ },
  reducers: {
    // your reducers
  },
});

export const { /* your actions */ } = newSlice.actions;
export default newSlice.reducer;
```

Then add to store:

```typescript
// src/store/index.ts
import newReducer from './slices/newSlice';

export const store = configureStore({
  reducer: {
    // ... other reducers
    new: newReducer,
  },
});
``` 