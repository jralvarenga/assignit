import React, { useState } from 'react'
import { StatusBar, StyleSheet, View, Dimensions } from 'react-native'
import auth from '@react-native-firebase/auth'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { LoginManager as FacebookLoginManager, AccessToken as FacebookAccessToken } from 'react-native-fbsdk-next'
import { signIn } from '../lib/auth'
import LottieView from 'lottie-react-native'
import { useSubjectProvider } from '../services/SubjectsProvider'
import { Animate } from 'react-native-entrance-animation'
import GoogleLogo from '../assets/icons/google_icon.svg'
import FacebookLogo from '../assets/icons/facebook_icon.svg'
import { TouchableRipple, Text } from 'react-native-paper'
import { useTranslation } from 'react-i18next'
import { theme } from '../services/theme'
import FailedBumpIcon from '../assets/icons/failedbump_logo.svg'

const { height } = Dimensions.get('screen')

const SignInScreen = () => {
  const { t } = useTranslation()
  const styles = styleSheet(theme)
  const { render, setRender }: any = useSubjectProvider()
  const [error, setError] = useState("")

  const googleSignIn = async() => {
    setError("")
    try {
      await GoogleSignin.hasPlayServices()
      const { idToken } = await GoogleSignin.signIn()
      const googleUser = await GoogleSignin.getTokens()
      const accessToken = googleUser.accessToken
      const googleCredential = auth.GoogleAuthProvider.credential(idToken)
      
      await signIn(googleCredential, accessToken, 'google', t)
      setRender(render + 1)
    } catch (error) {
      if (error.message) {
        setError(error.message)
      } else {
        setError(JSON.stringify(error))
      }
      console.log(error)
    }    
  }

  const facebookSignIn = async() => {
    setError("")
    try {
      const result = await FacebookLoginManager.logInWithPermissions(["public_profile", "email"])
      if (result.isCancelled) {
        setError('Cancelled')
        return
      }
      const data = await FacebookAccessToken.getCurrentAccessToken()
      if (!data) {
        setError('Something went wrong obtaining access token')
        return
      }
      const facebookCredential = auth.FacebookAuthProvider.credential(data!.accessToken)
      await signIn(facebookCredential, data!.accessToken, 'facebook', t)
      setRender(render + 1)
    } catch (error) {
      if (error.message) {
        setError(error.message)
      } else {
        setError(JSON.stringify(error))
      }
      console.log(error)
    }    
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary}/>
      <View style={{ ...StyleSheet.absoluteFillObject }}>
        <View style={styles.appIntro}>
          <LottieView
            source={require('../assets/animations/signin-background.json')}
            autoPlay
            loop
          />
          <Text selectable style={[styles.font, {color: theme.colors.background, fontSize: 14}]}>
            {error}
          </Text>
          <Animate fade delay={50}>
            <Text style={[styles.font, {color: theme.colors.background, fontSize: 50}]}>
              Assignit
            </Text>
          </Animate>
          <Animate fade delay={100}>
            <Text style={[styles.font, {color: theme.colors.surface, fontSize: 16, textAlign: 'center', marginTop: -10}]}>
              {t("Keep everything organized")}
            </Text>
          </Animate>
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.buttonContainer}>
          {/* GOOGLE */}
          <TouchableRipple
            borderless
            rippleColor={theme.colors.surface}
            onPress={googleSignIn}
            style={{ borderRadius: 100 }}
          >
            <Animate fade delay={50} containerStyle={styles.signInButton}>
              <View style={{ width: '40%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GoogleLogo width={30} height={30} />
              </View>
              <Text style={[styles.font, {width: '60%',fontSize: 20}]}>Google</Text>
            </Animate>
          </TouchableRipple>
          {/* FACEBOOK */}
          <TouchableRipple
            borderless
            rippleColor={theme.colors.surface}
            onPress={facebookSignIn}
            style={{ borderRadius: 100, marginTop: 10 }}
          >
            <Animate fade delay={150} containerStyle={[styles.signInButton, { backgroundColor: '#3b5998' }]}>
              <View style={{ width: '40%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FacebookLogo width={40} height={40} />
              </View>
              <Text style={[styles.font, {width: '60%',fontSize: 20, color: "#fff"}]}>Facebook</Text>
            </Animate>
          </TouchableRipple>
        </View>
        
        
       </View>
       
        <View style={styles.bottom}>
          <FailedBumpIcon style={{ marginLeft: '3%' }} width={35} height={30.8} />
        </View>
    </View>
  )
}

const styleSheet = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'flex-end'
  },
  body: {
    height: height * 0.3,
  },
  font: {
    fontFamily: 'poppins-bold',
    color: theme.colors.text
  },
  appIntro: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  signInButton: {
    width: '75%',
    height: 60,
    backgroundColor: theme.colors.background,
    borderRadius: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  bottom: {
    width: '100%',
    height: height * 0.07,
    display: 'flex',
    justifyContent: 'center'
  }
})

export default SignInScreen