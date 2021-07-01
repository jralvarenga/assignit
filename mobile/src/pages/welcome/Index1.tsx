import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import { Animate } from 'react-native-entrance-animation'
import LottieView from 'lottie-react-native'
import { useTranslation } from 'react-i18next'

interface WelcomeProps {
  display: boolean,
  setDisplay: Function
}

const Index1 = ({ display, setDisplay }: WelcomeProps) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const styles = styleSheet(theme)

  const nextHandler = () => {
    setDisplay(1)
  }

  if (display == false) {
    return <></>
  }

  return (
    <View style={styles.container}>
      
      <Animate fade delay={50} containerStyle={styles.imageContainer}>
        <LottieView
          source={require('../../assets/animations/group-in.json')}
          autoPlay
          loop
        />
      </Animate>
      
      <View style={styles.contentContainer}>
        <Animate fade delay={100} containerStyle={{ flex: 2 }}>
          <Text style={[styles.boldFont, {fontSize: 30, textAlign: 'center'}]}>
            {t("Have everything organized in groups")}
          </Text>
        </Animate>
        <Animate fade delay={150} containerStyle={{ flex: 3 }}>
          <View style={{ width: '95%' }}>
            <Text style={[styles.font, {fontSize: 18, textAlign: 'center', color: theme.colors.textPaper}]}>
              {t("Create a Subject to group all your Assigments or tasks")}
            </Text>
          </View>
        </Animate>
        <Animate fade delay={200} containerStyle={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity onPress={nextHandler} activeOpacity={0.7} style={styles.nextButton}>
            <Text style={[styles.boldFont, {fontSize: 16}]}>{t("Next")}</Text>
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
    backgroundColor: theme.colors.surface
  },
})

export default Index1