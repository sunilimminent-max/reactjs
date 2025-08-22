import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { connect } from 'react-redux'
import ProtectedRoute from '../components/ProtectedRoute'
import { AuthUtils, User } from '@/services/authUtils'
import { LogoutApiService } from '@/services/logoutApiService'
import agent from '@/agent'
import store from '@/store'


const Dashboard = (props: any) => {

  const { currentUser, logout } = props
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
   // console.log("currentUser",currentUser)
    // If not logged in, redirect to login
    if (!currentUser) {
      router.push('/login')
    }
  }, [currentUser, router])

  const handleLogout = async () => {
    setLoading(true)
    try {

      await agent.Auth.logout();
      await logout()
      store.dispatch({ type: 'LOGOUT', payload: null })
      router.push('/login')
    } catch (error) {
      await logout()
      store.dispatch({ type: 'LOGOUT', payload: null })
      router.push('/login')
    }
    setLoading(false)
  }

  if (!currentUser) {
    return null // Will redirect in useEffect
  }

  return (
    <ProtectedRoute currentUser={currentUser} accessfor={['super_admin','admin','user']}>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
              </div>
              <div className="flex items-center">
                <span className="text-gray-700 mr-4">Welcome, {currentUser?.name}</span>
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">User Information</h2>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{currentUser?.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{currentUser?.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">User ID</dt>
                    <dd className="mt-1 text-sm text-gray-900">{currentUser?.id}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="mt-6 bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Welcome to Your Dashboard</h2>
                <p className="text-gray-600">
                  This is your personal dashboard. You can add more features here like:
                </p>
                <ul className="mt-4 text-gray-600 list-disc list-inside space-y-2">
                  <li>Project management tools</li>
                  <li>Task tracking</li>
                  <li>Team collaboration features</li>
                  <li>Analytics and reports</li>
                  <li>Settings and preferences</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}

// Map Redux state to component props
const mapStateToProps = (state: any) => ({
  currentUser: state.common.currentUser,
})

// Map Redux dispatch to component props
const mapDispatchToProps = (dispatch: any) => ({
  logout: () => dispatch({ type: 'c/LogOut' })
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard) 