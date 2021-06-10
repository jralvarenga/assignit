import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import { Animate } from 'react-native-entrance-animation'
import LottieView from 'lottie-react-native'
import { Trans, useTranslation } from 'react-i18next'

interface WelcomeProps {
  display: boolean,
  setDisplay: Function
}

const AssignitBrandname = ({ children, theme }: any) => (
  <Text style={{fontFamily: 'poppins-bold', color: theme.colors.accent}}>
    {children}
  </Text>
)

const Index3 = ({ display, setDisplay }: WelcomeProps) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const styles = styleSheet(theme)

  const nextHandler = () => {
    setDisplay(3)
  }

  if (display == false) {
    return <></>
  }

  return (
    <View style={styles.container}>
      
      <Animate fade delay={50} containerStyle={styles.imageContainer}>
        <LottieView
          source={require('../../assets/animations/calendar.json')}
          autoPlay
          loop
        />
      </Animate>
      
      <View style={styles.contentContainer}>
        <Animate fade delay={100} containerStyle={{ flex: 2 }}>
          <Text style={[styles.font, {fontSize: 30, textAlign: 'center'}]}>
            {t("Sync with your Google Calendar")}
          </Text>
        </Animate>
        <Animate fade delay={150} containerStyle={{ flex: 3 }}>
          <Text style={[styles.font, {fontSize: 20, textAlign: 'center', color: theme.colors.textPaper}]}>
            <Trans
              i18nKey="Sign in with Google to sync Assignit with your calendar"
              t={t}
              components={[<AssignitBrandname theme={theme} />]}
            />
          </Text>
        </Animate>
        <Animate fade delay={200} containerStyle={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity onPress={nextHandler} activeOpacity={0.7} style={styles.nextButton}>
            <Text style={[styles.font, {fontSize: 16}]}>{t("Next")}</Text>
          </TouchableOpacity>
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
  font: {
    fontFamily: 'poppins-bold',
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
    width: 190,
    padding: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    backgroundColor: theme.colors.surface
  },
})

export default Index3