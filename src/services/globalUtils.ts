/**
 * Global utility functions for the application
 */
import agent from '@/agent'
/**
 * Gets the authentication token from localStorage
 * @returns {string | null} The token or null if not found
 */
export const getTokenData = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
  return null
}

/**
 * Gets the user data and token from API
 * @returns {Promise<string | null>} Promise that resolves to token or null
 */
export const getTokenDataFromAPI = async (): Promise<string | null> => {
  
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('jwt')
    if(token){
      try {
        agent.setToken(token);
        const res = await agent.Auth.user()
        if(res && res.data && res.data.user){
          return res.data
        }

        return null;
      } catch (error) {
        return null
      }
    }
  }
  return null
}
