import Head from 'next/head'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { getTokenDataFromAPI } from '@/services/globalUtils'
import { connect } from 'react-redux'
import store from '@/store'
import agent from '@/agent'
import Loader from '@/components/Loader'


const Main = (props: any) => {
  const { Component, pageProps, appLoaded, currentUser } = props

  useEffect(() => {
    const fetchTokenData = async () => {
      const tokenData = await getTokenDataFromAPI()
      const token = localStorage.getItem('jwt')
      if(token){
        agent.setToken(token);
      }
      store.dispatch({ type: 'APP_LOAD', payload: tokenData })
    }
    fetchTokenData()
  }, [])

  return (
    <>
      <Head>
        <title>Project Management</title>
        <meta name="description" content="Project Management" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {appLoaded ? 
         <Component {...pageProps} /> 
      : 
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader 
          type="ring" 
          size="large" 
          color="#2b8ebf" 
          text="Initializing Application..." 
        />
      </div>
      }
    </>
  )
} 

const mapStateToProps = (state: any) => ({
  appLoaded: state.common.appLoaded,
	currentUser: state.common.currentUser,
})

// Map Redux dispatch to component props
const mapDispatchToProps = (dispatch: any) => ({
  logout: () => dispatch({ type: 'auth/LogOut' })
})

export default connect(mapStateToProps, mapDispatchToProps)(Main) 