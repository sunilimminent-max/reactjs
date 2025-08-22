import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { connect } from 'react-redux'
import ProtectedRoute from '@/components/ProtectedRoute'
import agent from '@/agent'
import store from '@/store'
import AdminLayout from '@/pages/layouts/AdminLayout';

const Dashboard = (props: any) => {
  const { currentUser, logout } = props
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    console.log("currentUser",currentUser)
    // If not logged in, redirect to login
    if (!currentUser) {
     // router.push('/login')
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Welcome back, {currentUser?.name}!</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Here's what's happening with your projects today.
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-gray-700">Welcome, {currentUser?.name}</span>
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
        </div>

        

        {/* User Information */}
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

        
      </div>
    </AdminLayout>
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