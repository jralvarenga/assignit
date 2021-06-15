import React from 'react'
import { navigate } from 'gatsby'
import { AuthProvider } from '../../interfaces/interfaces'
import { useAuth } from '../../services/AuthProvider'

const Index = () => {
  const { user }: AuthProvider = useAuth()

  if (user == null) {
    navigate('/app/sign-in')
  }

  return (
    <div>hi</div>
  )
}

export default Index