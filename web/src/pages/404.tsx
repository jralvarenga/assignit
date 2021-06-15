import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import { Player } from '@lottiefiles/react-lottie-player'
import Ani404 from '../assets/animations/404.json'
import app_logo from '../assets/icons/app_logo.svg'
import { Link } from 'gatsby'
import Seo from '../components/seo'

const Page404 = () => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <Seo title="404" />


      <Link to="/">
        <img src={app_logo} className={classes.appLogo} alt="" />
      </Link>
      <Typography className={classes.title}>OH NOOO!!!</Typography>
      <Typography className={classes.subtitle}>This page doesn't exist, try again or return to home</Typography>
      <Player
        autoplay
        loop
        src={Ani404}
        className={classes.animation}
      />
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    color: theme.palette.primary.main,
    fontSize: 55,
    fontWeight: 700,
    [theme.breakpoints.down('xs')]: {
      fontSize: 45,
    }
  },
  subtitle: {
    fontSize: 30,
    fontWeight: 700,
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      fontSize: 25,
    }
  },
  animation: {
    width: 400,
    height: 400,
    animation: `$enterAnimation 600ms ${theme.transitions.easing.easeInOut}`,
    [theme.breakpoints.down('xs')]: {
      width: 300,
      height: 300,
    }
  },
  appLogo: {
    width: 70,
    height: 60,
    marginBottom: 30
  }
}))

export default Page404