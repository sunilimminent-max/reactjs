export interface User {
  id: number
  name: string
  email: string
  password: string
  role: 'admin' | 'manager' | 'super_admin' | 'user'
  created_at: Date
  updated_at: Date
}

export interface Project {
  id: number
  name: string
  description?: string
  status: 'active' | 'completed' | 'archived'
  owner_id: number
  created_at: Date
  updated_at: Date
}

export interface Task {
  id: number
  title: string
  description?: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  project_id: number
  assigned_to?: number
  created_by: number
  due_date?: Date
  created_at: Date
  updated_at: Date
}

export interface ProjectMember {
  id: number
  project_id: number
  user_id: number
  role: 'owner' | 'admin' | 'member' | 'viewer'
  created_at: Date
}

// Extended interfaces with related data
export interface UserWithProjects extends User {
  projects?: Project[]
  owned_projects?: Project[]
}

export interface ProjectWithDetails extends Project {
  owner?: User
  members?: (ProjectMember & { user: User })[]
  tasks?: Task[]
  task_count?: number
  completed_task_count?: number
}

export interface TaskWithDetails extends Task {
  project?: Project
  assigned_user?: User
  created_by_user?: User
}

// Input types for creating/updating records
export interface CreateUserInput {
  name: string
  email: string
  password: string
}

export interface UpdateUserInput {
  name?: string
  email?: string
  password?: string
}

export interface CreateProjectInput {
  name: string
  description?: string
  status?: Project['status']
  owner_id: number
}

export interface UpdateProjectInput {
  name?: string
  description?: string
  status?: Project['status']
}

export interface CreateTaskInput {
  title: string
  description?: string
  status?: Task['status']
  priority?: Task['priority']
  project_id: number
  assigned_to?: number
  created_by: number
  due_date?: Date
}

export interface UpdateTaskInput {
  title?: string
  description?: string
  status?: Task['status']
  priority?: Task['priority']
  assigned_to?: number
  due_date?: Date
}

export interface CreateProjectMemberInput {
  project_id: number
  user_id: number
  role?: ProjectMember['role']
}

// Post and PostMeta interfaces
export interface Post {
  id: number
  author_id: number
  date: Date
  date_gmt: Date
  content: string
  title: string
  excerpt?: string
  status: 'publish' | 'draft' | 'private' | 'trash'
  comment_status: 'open' | 'closed'
  ping_status: 'open' | 'closed'
  password?: string
  name?: string
  to_ping?: string
  pinged?: string
  modified: Date
  modified_gmt: Date
  content_filtered?: string
  parent_id: number
  guid?: string
  menu_order: number
  type: 'post' | 'page' | 'attachment' | 'revision'
  mime_type?: string
  comment_count: number
  created_at: Date
  updated_at: Date
  author_name?: string
}

export interface PostMeta {
  id: number
  post_id: number
  meta_key: string
  meta_value: string
  created_at: Date
  updated_at: Date
}

export interface CreatePostData {
  author_id: number
  content: string
  title: string
  excerpt?: string
  status?: Post['status']
  comment_status?: Post['comment_status']
  ping_status?: Post['ping_status']
  password?: string
  name?: string
  parent_id?: number
  type?: Post['type']
  mime_type?: string
}

export interface UpdatePostData {
  content?: string
  title?: string
  excerpt?: string
  status?: Post['status']
  comment_status?: Post['comment_status']
  ping_status?: Post['ping_status']
  password?: string
  name?: string
  parent_id?: number
  type?: Post['type']
  mime_type?: string
}

// Role-based types
export type UserRole = 'admin' | 'manager' | 'super_admin' | 'user'

export interface RolePermissions {
  canManageUsers: boolean
  canManageProjects: boolean
  canManageTasks: boolean
  canViewAllProjects: boolean
  canDeleteProjects: boolean
  canAssignTasks: boolean
  canDeleteTasks: boolean
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  super_admin: {
    canManageUsers: true,
    canManageProjects: true,
    canManageTasks: true,
    canViewAllProjects: true,
    canDeleteProjects: true,
    canAssignTasks: true,
    canDeleteTasks: true
  },
  admin: {
    canManageUsers: true,
    canManageProjects: true,
    canManageTasks: true,
    canViewAllProjects: true,
    canDeleteProjects: false,
    canAssignTasks: true,
    canDeleteTasks: true
  },
  manager: {
    canManageUsers: false,
    canManageProjects: true,
    canManageTasks: true,
    canViewAllProjects: true,
    canDeleteProjects: false,
    canAssignTasks: true,
    canDeleteTasks: false
  },
  user: {
    canManageUsers: false,
    canManageProjects: false,
    canManageTasks: false,
    canViewAllProjects: false,
    canDeleteProjects: false,
    canAssignTasks: false,
    canDeleteTasks: false
  }
}

// Custom Fields (ACF-like) interfaces
export interface CustomFieldGroup {
  id: number
  name: string
  key: string
  description?: string
  location_rules?: any
  menu_order: number
  active: boolean
  created_at: Date
  updated_at: Date
}

export interface CustomField {
  id: number
  field_group_id: number
  name: string
  key: string
  type: 'text' | 'textarea' | 'image' | 'select' | 'checkbox' | 'radio' | 'number' | 'email' | 'url' | 'date' | 'file' | 'wysiwyg' | 'repeater' | 'flexible_content'
  label: string
  instructions?: string
  required: boolean
  field_config?: any
  menu_order: number
  created_at: Date
  updated_at: Date
}

export interface CustomFieldValue {
  id: number
  post_id: number
  field_id: number
  value: string
  created_at: Date
  updated_at: Date
}

export interface CustomFieldWithValue extends CustomField {
  value?: string
}

export interface CustomFieldGroupWithFields extends CustomFieldGroup {
  fields: CustomFieldWithValue[]
}

// Input types for creating/updating custom fields
export interface CreateCustomFieldGroupInput {
  name: string
  key: string
  description?: string
  location_rules?: any
  menu_order?: number
  active?: boolean
}

export interface UpdateCustomFieldGroupInput {
  name?: string
  key?: string
  description?: string
  location_rules?: any
  menu_order?: number
  active?: boolean
}

export interface CreateCustomFieldInput {
  field_group_id: number
  name: string
  key: string
  type: CustomField['type']
  label: string
  instructions?: string
  required?: boolean
  field_config?: any
  menu_order?: number
}

export interface UpdateCustomFieldInput {
  name?: string
  key?: string
  type?: CustomField['type']
  label?: string
  instructions?: string
  required?: boolean
  field_config?: any
  menu_order?: number
} 