import React from 'react'
import { Typography } from '@material-ui/core'
import { Player } from '@lottiefiles/react-lottie-player'
import organizeAnimation from '../assets/animations/organize.json'
import groupInAnimation from '../assets/animations/group-in.json'
import chartAnimation from '../assets/animations/chart.json'
import calendarAnimation from '../assets/animations/calendar.json'
import confettiAnimation from '../assets/animations/confetti.json'
import googleIcon from '../assets/icons/google_icon.svg'
import fbIcon from '../assets/icons/facebook_icon.svg'

// Index 0

export const Index0Text = ({ classes }: any) => (
  <div className={classes.textContainer}>
    <Typography className={classes.titleText}>
      Start getting organized with <span className={classes.primaryText}>Assignit</span>
    </Typography>
    <Typography className={classes.subText}>
      Keep all your tasks in one place
    </Typography>
  </div>
)

export const Index0Animation = ({ classes }: any) => (
  <Player
    autoplay
    loop
    src={organizeAnimation}
    className={classes.animationContainer}
  />
)

// Index 1

export const Index1Text = ({ classes }: any) => (
  <div className={classes.textContainer}>
    <Typography className={classes.titleText}>
      Have everything organized in groups
    </Typography>
    <Typography className={classes.subText}>
    Create a Subject to group all your Assigments or tasks
    </Typography>
  </div>
)

export const Index1Animation = ({ classes }: any) => (
  <Player
    autoplay
    loop
    src={groupInAnimation}
    className={classes.animationContainer}
  />
)

// Index 2

export const Index2Text = ({ classes }: any) => (
  <div className={classes.textContainer}>
    <Typography className={classes.titleText}>
      Check your progress in all your subjects
    </Typography>
    <Typography className={classes.subText}>
      An easy way to keep track on your tasks
    </Typography>
  </div>
)

export const Index2Animation = ({ classes }: any) => (
  <Player
    autoplay
    loop
    src={chartAnimation}
    className={classes.animationContainer}
  />
)

// Index 3

export const Index3Text = ({ classes }: any) => (
  <div className={classes.textContainer}>
    <Typography className={classes.titleText}>
      Sync with your Google Calendar
    </Typography>
    <Typography className={classes.subText}>
      Sign in with Google to sync <span className={classes.primaryText}>Assignit</span> with your calendar
    </Typography>
  </div>
)

export const Index3Animation = ({ classes }: any) => (
  <Player
    autoplay
    loop
    src={calendarAnimation}
    className={classes.animationContainer}
  />
)

// Index 4

export const Index4Text = ({ classes }: any) => (
  <div className={classes.textContainer}>
    <Typography className={classes.titleText}>
      Start now
    </Typography>
    <Typography className={classes.subText}>
      Install the app and sign in with
    </Typography>
    <div className={classes.signInMethods}>
      <img src={googleIcon} style={{ width: 40, height: 40, marginRight: 10 }} alt="" />
      <img src={fbIcon} style={{ width: 40, height: 40, marginLeft: 10 }} alt="" />
    </div>
  </div>
)

export const Index4Animation = ({ classes }: any) => (
  <Player
    autoplay
    loop
    src={confettiAnimation}
    className={classes.animationContainer}
  />
)