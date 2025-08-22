import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, logoutUser, fetchCurrentUser } from '../store/slices/authSlice';
import { fetchProjects } from '../store/slices/projectSlice';
import { fetchTasks } from '../store/slices/taskSlice';
import { addNotification, toggleTheme } from '../store/slices/uiSlice';

const ReduxExample: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const { user, isAuthenticated, loading: authLoading } = useAppSelector((state: any) => state.auth);
  const { projects, loading: projectsLoading } = useAppSelector((state: any) => state.projects);
  const { tasks, loading: tasksLoading } = useAppSelector((state: any) => state.tasks);
  const { theme, notifications } = useAppSelector((state: any) => state.ui);

  useEffect(() => {
    // Check if user is authenticated on component mount
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  useEffect(() => {
    // Fetch projects and tasks when user is authenticated
    if (isAuthenticated) {
      dispatch(fetchProjects());
      dispatch(fetchTasks());
    }
  }, [isAuthenticated, dispatch]);

  const handleLogin = () => {
    dispatch(loginUser({
      email: 'test@example.com',
      password: 'password123'
    }));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleAddNotification = () => {
    dispatch(addNotification({
      type: 'success',
      message: 'This is a test notification!',
      duration: 3000
    }));
  };

  return (
    <div className={`p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <h1 className="text-2xl font-bold mb-4">Redux Example</h1>
      
      {/* Theme Toggle */}
      <div className="mb-4">
        <button
          onClick={handleToggleTheme}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Toggle Theme (Current: {theme})
        </button>
      </div>

      {/* Authentication Section */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Authentication</h2>
        {authLoading ? (
          <p>Loading...</p>
        ) : isAuthenticated ? (
          <div>
            <p>Welcome, {user?.name}!</p>
            <p>Email: {user?.email}</p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Login
          </button>
        )}
      </div>

      {/* Projects Section */}
      {isAuthenticated && (
        <div className="mb-6 p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Projects</h2>
          {projectsLoading ? (
            <p>Loading projects...</p>
          ) : (
            <div>
              <p>Total projects: {projects.length}</p>
              {projects.map((project: any) => (
                <div key={project.id} className="p-2 bg-gray-100 rounded mb-2">
                  <h3 className="font-semibold">{project.name}</h3>
                  <p className="text-sm">{project.description}</p>
                  <span className="text-xs bg-blue-200 px-2 py-1 rounded">
                    {project.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tasks Section */}
      {isAuthenticated && (
        <div className="mb-6 p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Tasks</h2>
          {tasksLoading ? (
            <p>Loading tasks...</p>
          ) : (
            <div>
              <p>Total tasks: {tasks.length}</p>
              {tasks.map((task: any) => (
                <div key={task.id} className="p-2 bg-gray-100 rounded mb-2">
                  <h3 className="font-semibold">{task.title}</h3>
                  <p className="text-sm">{task.description}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs bg-green-200 px-2 py-1 rounded">
                      {task.status}
                    </span>
                    <span className="text-xs bg-yellow-200 px-2 py-1 rounded">
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Notifications Section */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Notifications</h2>
        <button
          onClick={handleAddNotification}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 mb-2"
        >
          Add Test Notification
        </button>
        <div>
          {notifications.map((notification: any) => (
            <div
              key={notification.id}
              className={`p-2 rounded mb-2 ${
                notification.type === 'success' ? 'bg-green-200 text-green-800' :
                notification.type === 'error' ? 'bg-red-200 text-red-800' :
                notification.type === 'warning' ? 'bg-yellow-200 text-yellow-800' :
                'bg-blue-200 text-blue-800'
              }`}
            >
              {notification.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReduxExample; 