import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Modal, Backdrop, Fade, Typography, Button, withStyles, useTheme } from '@material-ui/core'
import androidIcon from '../assets/icons/android_icon.svg'
import pwaIcon from '../assets/icons/pwa_icon.svg'
import { Android as PlayStoreIcon, GetApp as GetAppIcon } from '@material-ui/icons';
import { Link } from 'gatsby'

interface InstallAppModal {
  open: boolean;
  setOpen: Function;
}

const InstallAppModal = ({ open, setOpen }: InstallAppModal) => {
  const classes = useStyles()
  const theme = useTheme()

  return (
    <Modal
      open={open}
      className={classes.modal}
      onClose={() => setOpen(false)}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className={classes.container}>

          <div className={classes.top}>
            <Typography variant="h5" style={{ fontWeight: 700 }}>
              Install Assignit
            </Typography>
          </div>
          <div className={classes.body}>

            <div className={classes.bodyContainer}>
              <div style={{ minHeight: 81, marginTop: 15 }}>
                <img className={classes.androidIcon} src={androidIcon} alt="" />
              </div>
              <div>
                <ul>
                  <li><Typography>Integrated agenda</Typography></li>
                  <li><Typography>No ads</Typography></li>
                  <li><Typography>Receive reminder notifications</Typography></li>
                  <li><Typography>More fast and efficient</Typography></li>
                  <li><Typography>Use it offline</Typography></li>
                </ul>
              </div>
              <div style={{ marginTop: 20 }}>
                <PlayStoreButton
                  disableElevation
                  variant="contained"
                  style={{ textTransform: 'none', borderRadius: 10, color: '#fff' }}
                  startIcon={<PlayStoreIcon />}
                >Comming soon</PlayStoreButton>
              </div>
            </div>
            <div className={classes.bodyContainer}>
              <div style={{ minHeight: 81, marginTop: 15 }}>
                <img className={classes.pwaIcon} src={pwaIcon} alt="" />
              </div>
              <div>
                <ul>
                  <li><Typography>Takes minimum space</Typography></li>
                  <li><Typography>Ads</Typography></li>
                  <li><Typography>No notifications</Typography></li>
                  <li><Typography>Multiplatform (Android, IOS, Desktop)</Typography></li>
                  <li><Typography>Need to be online</Typography></li>
                </ul>
              </div>
              <div style={{ marginTop: 20 }}>
                <PWAButton
                  disableElevation
                  variant="contained"
                  style={{ textTransform: 'none', borderRadius: 10, color: '#fff' }}
                  startIcon={<GetAppIcon />}
                >Comming soon</PWAButton>
              </div>
            </div>
                        
          </div>
          <div className={classes.bottom}>
            <Typography style={{ fontWeight: 700, color: theme.palette.text.secondary, fontSize: 16}}>
              An app by @FailedBump
            </Typography>
            <Typography style={{ fontWeight: 700, color: theme.palette.text.secondary, fontSize: 16, textAlign: 'right'}}>
              See our <Link style={{ color: theme.palette.primary.main }} to="/terms-conditions">Terms & Conditions</Link> and <Link style={{ color: theme.palette.primary.main }} to="/privacy-policy">Privacy Policy</Link>
            </Typography>
          </div>

        </div>
      </Fade>
    </Modal>
  )
}

const PlayStoreButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText('#3ddc84'),
    backgroundColor: '#3ddc84',
    '&:hover': {
      backgroundColor: '#10e36e',
    },
  },
}))(Button)

const PWAButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText('#854da7'),
    backgroundColor: '#854da7',
    '&:hover': {
      backgroundColor: '#7d36a8',
    },
  },
}))(Button)

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: '60%',
    height: '90%',
    borderRadius: 30,
    padding: 30,
    display: 'flex',
    flexDirection: 'column',
    background: theme.palette.background.default,
    [theme.breakpoints.down('xs')]: {
      width: '95%',
      height: '90%',
      overflowY: 'scroll',
    }
  },
  top: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    }
  },
  body: {
    flex: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    }
  },
  bodyContainer: {
    width: '50%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      marginTop: 20
    }
  },
  androidIcon: {
    width: 100,
    height: 81
  },
  pwaIcon: {
    width: 100,
    height: 38
  },
  bottom: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.down('xs')]: {
      marginTop: 20
    }
  },
}))

export default InstallAppModal