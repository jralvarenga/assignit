import React, { useEffect, useState } from 'react'
import Seo from '../components/seo'
import { Button, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { GetApp as GetAppIcon/*, Launch as LaunchIcon*/ } from '@material-ui/icons'

import logo from '../assets/icons/app_logo.svg'
import {
  Index0Animation,
  Index0Text,
  Index1Animation,
  Index1Text,
  Index2Animation,
  Index2Text,
  Index3Animation,
  Index3Text,
  Index4Animation,
  Index4Text
} from '../components/WelcomeTextAnimation'
import InstallAppModal from '../components/InstallAppModal'
import { Link } from 'gatsby'

const HomePage = () => {
  const classes = useStyles()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showInstallApp, setShowInstallApp] = useState(false)

  const handleChangeNextIndex = () => {
    if (currentIndex < 4) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setCurrentIndex(0)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      handleChangeNextIndex()
    }, 10000)
    return () => clearInterval(interval)
  }, [currentIndex])

  return (
    <div>
      <Seo title='Welcome' />

      <div className={classes.container}>

        <div className={classes.topBar}>
          <div className={classes.topContainer}>
            <img className={classes.logoIcon} src={logo} alt="" />
            <div className={classes.buttonsContainer}>
              {/*<Button
                disableElevation
                color="primary"
                style={{ textTransform: 'none', borderRadius: 10, marginRight: 30 }}
                startIcon={<LaunchIcon />}
              >Open
              </Button>*/}
              <Button
                disableElevation
                variant="contained"
                color="primary"
                onClick={() => setShowInstallApp(true)}
                style={{ textTransform: 'none', borderRadius: 10 }}
                startIcon={<GetAppIcon />}
              >Install app
              </Button>
            </div>
          </div>
        </div>

        <div className={classes.body}>
          <div className={classes.bodyContainer}>

            <div className={classes.bodyBox}>
              <HandleScreenText classes={classes} index={currentIndex} />
              <div className={classes.indexContainer}>
                {[0, 1, 2, 3, 4].map((i) => (
                  currentIndex == i ? (
                    <span
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={classes.index}
                      style={{ background: '#c9c9c9' }}
                    />
                  ) : (
                    <span
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={classes.index}
                    />
                  )
                ))}
              </div>
            </div>

            <div className={classes.bodyBox}>
              <HandleScreenAnimation classes={classes} index={currentIndex} />
            </div>

          </div>
        </div>

        <div className={classes.bottom}>
          <Typography className={classes.text}>
            See our <Link to='/terms-conditions'>Terms & Conditions</Link> and our <Link to='/privacy-policy'>Privacy Policy</Link>
          </Typography>
        </div>

      </div>


      <InstallAppModal open={showInstallApp} setOpen={setShowInstallApp} />
    </div>
  )
}

const HandleScreenText = ({ index, classes }: { index: number, classes: any }) => {
  switch (index) {
    case 0:
      return <Index0Text classes={classes} />
    case 1:
      return <Index1Text classes={classes} />
    case 2:
      return <Index2Text classes={classes} />
    case 3:
      return <Index3Text classes={classes} />
    case 4:
      return <Index4Text classes={classes} />
    default:
      return <Index0Text classes={classes} />
  }
}

const HandleScreenAnimation = ({ index, classes }: { index: number, classes: any }) => {
  switch (index) {
    case 0:
      return <Index0Animation classes={classes} />
    case 1:
      return <Index1Animation classes={classes} />
    case 2:
      return <Index2Animation classes={classes} />
    case 3:
      return <Index3Animation classes={classes} />
    case 4:
      return <Index4Animation classes={classes} />
    default:
      return <Index0Animation classes={classes} />
  }
}

const useStyles = makeStyles((theme) => ({
  container: {
    background: theme.palette.background.default,
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  topBar: {
    flex: 1,
    [theme.breakpoints.down('xs')]: {
      flex: 0.3
    }
  },
  topContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '2%',
    paddingRight: '2%',
    [theme.breakpoints.down('xs')]: {
      marginTop: 15,
      paddingRight: '2%',
    }
  },
  logoIcon: {
    width: 50,
    height: 60,
    [theme.breakpoints.down('xs')]: {
      width: 30,
      height: 40,
    }
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  body: {
    flex: 7,
    [theme.breakpoints.down('xs')]: {
      flex: 3
    }
  },
  bodyContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column-reverse',
    }
  },
  bodyBox: {
    width: '50%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    }
  },
  textContainer: {
    width: '95%',
    height: 300,
    textAlign: 'center',
    animation: `$enterAnimation 600ms ${theme.transitions.easing.easeInOut}`,
    [theme.breakpoints.down('xs')]: {
      height: 200,
    }
  },
  primaryText: {
    color: theme.palette.primary.main
  },
  indexContainer: {
    width: '95%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    animation: `$enterAnimation 800ms ${theme.transitions.easing.easeInOut}`,
    [theme.breakpoints.down('xs')]: {
      marginTop: 30,
    }
  },
  index: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: theme.palette.background.paper,
    marginLeft: 5,
    marginRight: 5,
    cursor: 'pointer',
    animation: `$enterAnimation 900ms ${theme.transitions.easing.easeInOut}`
  },
  animationContainer: {
    width: 600,
    height: 600,
    animation: `$enterAnimation 600ms ${theme.transitions.easing.easeInOut}`,
    [theme.breakpoints.down('xs')]: {
      width: 300,
      height: 300,
    }
  },
  titleText: {
    fontSize: 50,
    fontWeight: 800,
    [theme.breakpoints.down('xs')]: {
      fontSize: 30,
    }
  },
  subText: {
    fontSize: 30,
    fontWeight: 700,
    marginTop: 40,
    color: theme.palette.text.secondary,
    [theme.breakpoints.down('xs')]: {
      fontSize: 20,
      marginTop: 20,
    }
  },
  text: {
    fontSize: 14,
    marginRight: 10
  },
  bottom: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  signInMethods: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  "@keyframes enterAnimation": {
    "0%": {
      opacity: 0,
    },
    "100%": {
      opacity: 1,
    }
  }
}))

export default HomePage
