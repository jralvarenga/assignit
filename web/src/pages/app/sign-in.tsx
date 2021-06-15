import React from 'react'
//import { Player } from '@lottiefiles/react-lottie-player'
import {makeStyles } from '@material-ui/core'
import googleIcon from '../../assets/icons/google_icon.svg'
import facebookIcon from '../../assets/icons/facebook_icon.svg'
import firebase from '../../firebase/config'
import Seo from '../../components/seo'
import { signIn } from '../../lib/auth'
//import backgroundAnimation from '../../assets/animations/signin-background.json'

const SignIn = () => {
  const classes = useStyles()

  const googleSignIn = async() => {
    const provider = new firebase.auth.GoogleAuthProvider()
    await signIn(provider, 'google')
  }

  const facebookSignIn = async() => {
    const provider = new firebase.auth.FacebookAuthProvider()
    await signIn(provider, 'facebook')
  }

  return (
    <div className={classes.container}>
      <Seo title="Sign in" />

      <div className={classes.signInContainer}>
        <span className={classes.title}>Assignit</span>
        <span className={classes.subtitle}>Keep all your tasks or assigments organized 📅💫</span>
        <span className={classes.signInWithText}>Sign in with:</span>
        <div className={classes.buttonsContainer}>
          
          <div className={classes.button} onClick={googleSignIn}>
            <div style={{ width: '40%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={googleIcon} style={{ width: 30, height: 30 }} alt="" />
            </div>
            <span style={{width: '60%',fontSize: 20}}>Google</span>
          </div>
          <div className={classes.button} onClick={facebookSignIn} style={{ marginTop: 15, background: '#3b5998' }}>
            <div style={{ width: '40%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={facebookIcon} style={{ width: 40, height: 40 }} alt="" />
            </div>
            <span style={{width: '60%',fontSize: 20, color: '#fff'}}>Facebook</span>
          </div>

        </div>
        {/*<Player
          autoplay
          loop
          src={backgroundAnimation}
          className={classes.animationContainer}
        />*/}
      </div>

    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: theme.palette.primary.main
  },
  signInContainer: {
    width: '40%',
    height: '80%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      width: '95%',
    }
  },
  title: {
    fontSize: 50,
    width: '100%',
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 18,
    marginTop: 15,
    width: '100%',
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold'
  },
  signInWithText: {
    fontSize: 16,
    marginTop: 20,
    color: '#fff',
    fontWeight: 'bold',
    [theme.breakpoints.down('xs')]: {
      marginTop: 60,
    }
  },
  animationContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  buttonsContainer: {
    marginTop: 40,
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      marginTop: 25,
    }
  },
  button: {
    width: 300,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    cursor: 'pointer'
  }
}))

export default SignIn