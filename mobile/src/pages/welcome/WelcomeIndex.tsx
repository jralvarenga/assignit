import React, { useState } from 'react'
import { Animate } from 'react-native-entrance-animation'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import Index0 from './Index0'
import Index1 from './Index1'
import Index2 from './Index2'
import Index3 from './Index3'
import Index4 from './Index4'
import { useTranslation } from 'react-i18next'

const WelcomeIndex = ({ setFalseOpenFirstTime, setOpenFirstTime }: any) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const styles = styleSheet(theme)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [display0, setDisplay0] = useState(true)
  const [display1, setDisplay1] = useState(false)
  const [display2, setDisplay2] = useState(false)
  const [display3, setDisplay3] = useState(false)
  const [display4, setDisplay4] = useState(false)

  const displaySlideHandler = (index: number) => {
    switch (index) {
      case 0:
        setDisplay0(false)
        setDisplay2(false)
        setDisplay3(false)
        setDisplay4(false)

        setDisplay1(true)
        setCurrentIndex(1)
      break;
      case 1:
        setDisplay0(false)
        setDisplay1(false)
        setDisplay3(false)
        setDisplay4(false)

        setDisplay2(true)
        setCurrentIndex(2)
      break;
      case 2:
        setDisplay0(false)
        setDisplay1(false)
        setDisplay2(false)
        setDisplay4(false)

        setDisplay4(true)
        setCurrentIndex(4)
      break;
      case 3:
        setDisplay0(false)
        setDisplay1(false)
        setDisplay2(false)
        setDisplay3(false)

        setDisplay4(true)
        setCurrentIndex(4)
      break;
      case -1:
        setDisplay1(false)
        setDisplay2(false)
        setDisplay3(false)
        setDisplay4(false)

        setDisplay0(true)
        setCurrentIndex(0)
      break;
      default:
        break;
    }
  }

  const goToSignIn = () => {
    setFalseOpenFirstTime()
    setOpenFirstTime(false)
  }

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={{ flex: 1 }}>
        <Index0 display={display0} setDisplay={displaySlideHandler} />
        <Index1 display={display1} setDisplay={displaySlideHandler} />
        <Index2 display={display2} setDisplay={displaySlideHandler} />
        {/*<Index3 display={display3} setDisplay={displaySlideHandler} />*/}
        <Index4 display={display4} goToSignIn={goToSignIn} />
      </View>

      <Animate fade delay={250} containerStyle={styles.footer}>
        <TouchableOpacity onPress={goToSignIn} activeOpacity={0.7} style={styles.skipButton}>
          <Text style={[styles.font, {fontSize: 14}]}>
            {t("Skip")}
          </Text>
        </TouchableOpacity>
        <View style={styles.indexContainer}>
          {[0, 1, 2, /*3,*/ 4].map((item) => (
            currentIndex == item ? (
              <TouchableOpacity
                key={item}
                activeOpacity={0.7}
                style={[styles.indexCircle, {backgroundColor: '#c9c9c9'}]}
              />
            ) : (
              <TouchableOpacity
                key={item}
                activeOpacity={0.7}
                style={styles.indexCircle}
                onPress={() => displaySlideHandler(item - 1)}
              />
            )
          ))}
        </View>
      </Animate>

    </SafeAreaView>
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
  footer: {
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  indexContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: '3%'
  },
  indexCircle: {
    width: 20,
    height: 20,
    backgroundColor: theme.colors.surface,
    borderRadius: 100,
    marginLeft: 7,
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
  skipButton: {
    width: 100,
    marginLeft: '3%',
    padding: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    backgroundColor: theme.colors.surface
  }
})

export default WelcomeIndex