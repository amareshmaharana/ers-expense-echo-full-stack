import { createContext, useContext, useEffect, useState } from 'react'
import http from '../api/http'

const AuthContext = createContext(null)

const storageTokenKey = 'ers_token'
const storageUserKey = 'ers_user'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem(storageUserKey)
    return cached ? JSON.parse(cached) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem(storageTokenKey))
  const [loading, setLoading] = useState(Boolean(token))

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await http.get('/auth/me')
        setUser(response.data.data.user)
        localStorage.setItem(storageUserKey, JSON.stringify(response.data.data.user))
      } catch (error) {
        localStorage.removeItem(storageTokenKey)
        localStorage.removeItem(storageUserKey)
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    bootstrap()
  }, [token])

  const login = async (email, password, expectedRole = 'Auto Detect') => {
    const response = await http.post('/auth/login', { email, password })
    const nextToken = response.data.data.token
    const nextUser = response.data.data.user

    if (expectedRole !== 'Auto Detect' && nextUser.role !== expectedRole) {
      throw new Error(`This account belongs to ${nextUser.role}. Choose that role to continue.`)
    }

    localStorage.setItem(storageTokenKey, nextToken)
    localStorage.setItem(storageUserKey, JSON.stringify(nextUser))
    setToken(nextToken)
    setUser(nextUser)
    return nextUser
  }

  const register = async (payload) => {
    const response = await http.post('/auth/register', payload)
    const nextToken = response.data.data.token
    const nextUser = response.data.data.user

    localStorage.setItem(storageTokenKey, nextToken)
    localStorage.setItem(storageUserKey, JSON.stringify(nextUser))
    setToken(nextToken)
    setUser(nextUser)
    return nextUser
  }

  const logout = () => {
    localStorage.removeItem(storageTokenKey)
    localStorage.removeItem(storageUserKey)
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
