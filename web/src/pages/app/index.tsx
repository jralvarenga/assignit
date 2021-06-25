import React from 'react'
//import { navigate } from 'gatsby'
//import { AuthProvider } from '../../interfaces/interfaces'
//import { useAuth } from '../../services/AuthProvider'
import { makeStyles } from '@material-ui/core'
import Seo from '../../components/seo'

const Index = () => {
  //const { user }: AuthProvider = useAuth()
  const classes = useStyles()

  /*if (user == null) {
    navigate('/app/sign-in')
  }*/

  return (
    <div className={classes.container}>
      <Seo title="App" />

      hi
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    height: '100vh',
    display: 'flex'
  }
}))

export default Index