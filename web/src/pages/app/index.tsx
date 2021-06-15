import React from 'react'
import { AuthProvider } from '../../interfaces/interfaces'
import { useAuth } from '../../services/AuthProvider'

const Index = () => {
  const { user }: AuthProvider = useAuth()
  console.log(user);

  return (
    <div>hi</div>
  )
}

export default Index