import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { connect } from 'react-redux'
import LoginForm from '@/components/LoginForm'
import { LOGIN } from '@/store/constants'
import store from '@/store'
import agent from '@/agent'
import MainLayout from './layouts/MainLayout'
import { getTokenDataFromAPI } from '@/services/globalUtils'



function Login({  loginData, login, currentUser }: any) {
  //console.log(loginData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleLogin = async (email: string, password: string) => {
    setError('')
    setSuccess('')
    setLoading(true)
    login({ email, password });
    return { success: true }; // Return expected type
  }

  useEffect(() => {
    const handleLoginSuccess = async () => {
      setLoading(false)
      if(loginData?.isSuccess === false){
        setError(loginData?.message)
      }else if(loginData?.isSuccess === true && loginData?.data?.token){
        setSuccess(loginData?.message)
        try {
          const tokenData = await getTokenDataFromAPI()
          if(tokenData){
            // Parse tokenData if it's a string, otherwise use as is
            const parsedData = typeof tokenData === 'string' ? JSON.parse(tokenData) : tokenData
            store.dispatch({ type: 'APP_LOAD', payload: parsedData })

            if(parsedData?.user?.role === 'super_admin' || parsedData?.user?.role === 'admin'){
              router.push('/admin/dashboard')
            }else{
              router.push('/dashboard')
            }
            
          }else{
            setError('Failed to get token data')
          }
        } catch (error) {
          console.error('Error getting token data:', error)
          setError('Failed to get token data')
        }
      }
      store.dispatch({ type: 'EMPTY_RESET' })
    }

    handleLoginSuccess()
  }, [loginData, router])

  useEffect(() => {
    if(currentUser){
      if(currentUser?.role === 'super_admin' || currentUser?.role === 'admin'){
        router.push('/admin/dashboard')
      }else{
        router.push('/dashboard')
      }
    }
  }, [currentUser, router])

  return (
    <MainLayout>
      <LoginForm
        onSubmit={handleLogin}
        loading={loading}
        error={error}
        success={success}
      />
    </MainLayout>
  )
}

// Map Redux state to component props
const mapStateToProps = (state: any) => ({
  currentUser: state.common.currentUser,
  token: state.common.token,
  loginData: state.common.loginData
})

// Map Redux dispatch to component props
const mapDispatchToProps = (dispatch: any) => ({
  login: (data: any) => dispatch({ type: LOGIN, payload: agent.Auth.login(data) })
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)