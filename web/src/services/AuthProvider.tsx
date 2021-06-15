import React, { createContext, useContext, useEffect, useState } from 'react'
import firebase from '../firebase/config'

const AuthContext = createContext({})

export const AuthProvider = ({ children }: any) => {
  //const [renderUser, setRenderUser] = useState
  const [user, setUser] = useState<any>(null)
  console.log(user);
  

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user)
      } else {
        setUser(null)
      }
    })

  }, [user])

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)