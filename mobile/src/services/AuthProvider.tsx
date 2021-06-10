import React, { createContext, FC, useContext, useEffect } from 'react'
import { useState } from 'react'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'

const AuthContext = createContext({})

export const AuthProvider: FC = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null)

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((userState) => {
      setUser(userState)

      if (loading) {
        setLoading(false)
      }
    })
    return subscriber
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)