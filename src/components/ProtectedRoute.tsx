import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { connect } from 'react-redux'
import { AuthUtils } from '@/services/authUtils'


const ProtectedRoute = (props: any) => {
  const { children, currentUser, accessfor } = props
  const [loading, setLoading] = useState(true)
  const [access, setAccess] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      // Check both Redux state and local storage for authentication
      if(accessfor.includes(currentUser?.role)){
        setLoading(false)
      }else{
        setLoading(false)
        setAccess(false)
      }
    }

    checkAuth()
  }, [router, currentUser])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!access) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Access Denied Icon */}
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <svg 
              className="w-10 h-10 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
          
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Access Denied
          </h1>
          
          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            Sorry, you don't have permission to access this page. 
            Please contact your administrator if you believe this is an error.
          </p>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            
            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition duration-200 ease-in-out"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Map Redux state to component props
const mapStateToProps = (state: any) => ({
  currentUser: state.common.currentUser,
})

export default connect(mapStateToProps)(ProtectedRoute) 