import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import Seo from '../components/seo'
import { Link } from 'gatsby'

const TermsConditions = () => {
  const classes = useStyles()

  return (
    <div>
      <Seo title='Privacy Policy' />
      
      <div className={classes.container}>
        <div style={{ width: '95%' }}>
          <div className={classes.titleContainer}>
            <Typography className={classes.title}>
              Privacy Policy
            </Typography>
            <Typography>
              Last update June 08, 2021
            </Typography>
          </div>

          <Typography className={classes.text}>
            <p>This privacy policy will help you understand how FailedBump ("us", "we", "our") uses and protects the data you provide to us when you visit and use https://failedbump.com and any of the services listed here.</p>
            <ul>
              <li>Assignit</li>
              <li>Passlog</li>
              <li>Playlify</li>
              <li>Moview</li>
            </ul>
            <p>We reserve the right to change this policy at any given time, of which you will be promptly updated. If you want to make sure that you are up to date with the latest changes, we advise you to frequently visit this page</p>
          </Typography>

          <div>
            <Typography className={classes.subTitle}>
              <p>Email Authentication And Data Collection</p>
            </Typography>
            <Typography className={classes.text}>
              <p>For some of our applications and services we provide a email authentication and/or social authentication (See next section), for email authentication, we may collect</p>
              <ul>
                <li>Your IP address</li>
                <li>Your contact information and email address.</li>
                <li>Other information such as interests and preferences.</li>
                <li>Data profile regarding your online behavior on our website</li>
              </ul>
              <p>This data will be collected to have a better experience in any of our services and applications</p>
              <p>We commit to never share your private information such as passwords, email, name, location, etc. that you enter in any of the services and applications listed below</p>
            </Typography>

            <Typography className={classes.subTitle}>
              <p>Social Authentications</p>
            </Typography>
            <Typography className={classes.text}>
              <p>We provide email and social authentication for some of our applications and services, our social authenticatio is listed right here</p>
              <ul>
                <li>Google Sign In</li>
                <li>Facebook Sign In</li>
                <li>Github Sign In</li>
                <li>Twitter Sign In</li>
              </ul>
              <p>Keep in mind that we have this services integrated with some of our applications and services, doesn't mean we serve all of the authentications services in all of our applications, the social auth services may differs for the correct operation of our services and applications</p>
              <p>Also keep in mind, the social auth listed below social auth is linked to the privacy policies of each of the services listed above, you can see it in the following links</p>
              <ul>
                <li><Link to='https://developers.google.com/terms/api-services-user-data-policy'>
                  Google OAuth Privacy Policy
                </Link></li>
                <li><Link to='https://www.facebook.com/about/privacy'>
                  Facebook Data Policy
                </Link></li>
                {/*<li><Link to='https://www.facebook.com/about/privacy'>
                  Github
                </Link></li>
                <li>Github Sign In</li>
                <li>Twitter Sign In</li>*/}
              </ul>
              <p><strong>Data Collection</strong></p>
              <p>For the proper functioning of our services and aplications, we integrate certain functionalities that connects our services to the social authentication you choose at the moment you sign in in any of our applications or services</p>

              <p><strong>How do we use the information</strong></p>
              <p>The only purpose of the data we collect from social auths is for a better experience in our applications and services, such as</p>
              <ul>
                <li>Display your email or name in your profile</li>
                <li>Send you notifications and emails regarding new features or new services added</li>
                <li>Better experience in our apps</li>
              </ul>
              
              <p><strong>What information do you share</strong></p>
              <p>At the moment of this privacy policy is written, we DO NOT share any of the information your entrust us with any third party service</p>
              <p>Keep in mind all conditions listed here in Social Authentication it is taken into account for all social auth services at the moment this privacy policy is written, also you can see the privacy policy of any of the services listed above</p>
              <p>We commit to always protect your personal information and not connect any information that endangers the security of your account</p>
            </Typography>

            <Typography className={classes.subTitle}>
              <p>Why We Collect Your Data</p>
            </Typography>
            <Typography className={classes.text}>
              <p>We are collecting your data for several reasons:</p>
              <ul>
                <li>To better understand your needs.</li>
                <li>To improve our services and products.</li>
                <li>To send you promotional emails containing the information we think you will findinteresting.</li>
                <li>To contact you to fill out surveys and participate in other types of market research.</li>
                <li>To customize our website according to your online behavior and personal preferences.</li>
              </ul>
            </Typography>

            <Typography className={classes.subTitle}>
              <p>Safeguarding and Securing the Data</p>
            </Typography>
            <Typography className={classes.text}>
              <p>FailedBump and all services listed below are committed to securing your data and keeping it confidential. FailedBump has done all in its power to prevent data theft, unauthorized access, and disclosure by implementing the latest technologies and software, which help us safeguard all the information we collect online</p>
            </Typography>
          </div>

        </div>
      </div>
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  container: {
    background: theme.palette.background.default,
    width: '100%',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    overflowY: 'scroll'
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30
  },
  title: {
    fontWeight: 800,
    color: theme.palette.primary.main,
    fontSize: 40
  },
  subTitle: {
    fontWeight: 800,
    color: theme.palette.text.secondary,
    fontSize: 30,
    marginTop: 20,
    marginBottom: 30
  },
  smallTitle: {
    fontWeight: 800,
    color: theme.palette.text.primary,
    fontSize: 22,
    marginTop: 10,
    marginBottom: 15
  },
  text: {
    fontSize: 16,
    color: theme.palette.text.primary,
  }
}))

export default TermsConditions