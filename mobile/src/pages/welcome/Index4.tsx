import React from 'react'
import { View, StyleSheet, Linking } from 'react-native'
import { Animate } from 'react-native-entrance-animation'
import LottieView from 'lottie-react-native'
import { TouchableRipple, Text, useTheme } from 'react-native-paper'
import GoogleLogo from '../../assets/icons/google_icon.svg'
import FacebookLogo from '../../assets/icons/facebook_icon.svg'
import { useTranslation } from 'react-i18next'

interface WelcomeProps {
  display: boolean,
  goToSignIn: Function
}

const Index0 = ({ display, goToSignIn }: WelcomeProps) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const styles = styleSheet(theme)

  const nextHandler = () => {
    goToSignIn()
  }

  if (display == false) {
    return <></>
  }

  const goToTermsConditions = async() => {
    await Linking.openURL('https://assignit.vercel.app/terms-conditions')
  }

  return (
    <View style={styles.container}>
      
      <Animate fade delay={50} containerStyle={styles.imageContainer}>
        <LottieView
          source={require('../../assets/animations/confetti.json')}
          autoPlay
          loop={false}
        />
        <Text style={[styles.boldFont, {fontSize: 45, color: theme.colors.primary, textAlign: 'center'}]}>
          {t("Start now")}
        </Text>
      </Animate>
      
      <View style={styles.contentContainer}>
        <Animate fade delay={100} containerStyle={{ flex: 1 }}>
          <Text style={[styles.boldFont, {fontSize: 30, textAlign: 'center'}]}>
            {t("Sign in with")}
          </Text>
          <View style={styles.signInOptions}>
            <GoogleLogo style={styles.option} width={35} height={35} />
            <FacebookLogo style={styles.option} width={40} height={40} />
          </View>
        </Animate>
        <Animate fade delay={150} containerStyle={{ flex: 3 }}>
        </Animate>
        <Animate fade delay={200} containerStyle={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <TouchableRipple
            borderless
            onPress={nextHandler}
            rippleColor={theme.colors.surface}
            style={styles.nextButton}
          >
            <Text style={[styles.boldFont, {fontSize: 16, color: theme.colors.background}]}>
              {t("Start now")}
            </Text>
          </TouchableRipple>
          <Text onPress={goToTermsConditions} style={[styles.font, {
            fontSize: 15,
            marginTop: 15,
            color: theme.colors.primary,
            textDecorationLine: "underline",
            textDecorationStyle: "solid",
            textDecorationColor: theme.colors.primary
          }]}>
              See our Terms & Conditions
            </Text>
        </Animate>
      </View>
    </View>
  )
}

const styleSheet = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  boldFont: {
    fontFamily: 'poppins-bold',
    color: theme.colors.text,
    fontSize: 16
  },
  font: {
    fontFamily: 'poppins-semibold',
    color: theme.colors.text,
    fontSize: 16
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center'
  },
  nextButton: {
    paddingLeft: 65,
    paddingRight: 65,
    padding: 15,
    borderRadius: 100,
    backgroundColor: theme.colors.primary
  },
  signInOptions: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30
  },
  option: {
    marginLeft: 15,
    marginRight: 15
  }
})

export default Index0