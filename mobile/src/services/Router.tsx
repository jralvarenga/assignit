import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { Provider as PaperProvider } from 'react-native-paper'
import AppStack from '../stack/AppStack'
import { theme as lightTheme, darkTheme } from './theme'
import { useAuth } from './AuthProvider'
import SignInScreen from '../pages/SignIn'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Settings, ThemeProvider } from '../interface/interfaces'
import WelcomeStack from '../stack/WelcomeStack'
import { StatusBar } from 'react-native'
import { useUserColorScheme } from './ThemeProvider'

const Router = () => {
  const { user }: any = useAuth()
  const { colorScheme }: ThemeProvider = useUserColorScheme()
  const [theme, setTheme] = useState(lightTheme)
  const [openFirstTime, setOpenFirstTime] = useState<boolean>()

  const setThemeHandler = () => {
    switch (colorScheme) {
      case 'light':
        setTheme(lightTheme)
      break
      case 'dark':
        setTheme(darkTheme)
      break
      default:
        setTheme(lightTheme)
      break
    }
  }

  const isFirstTime = async() => {
    const settingsString = await AsyncStorage.getItem('settings')
    const settings: Settings = settingsString != null ? JSON.parse(settingsString) : {}

    if (settings.openFirstTime || settings.openFirstTime == undefined) {
      setOpenFirstTime(true)
    } else {
      setOpenFirstTime(false)
    }
  }

  const setFalseOpenFirstTime = async() => {
    const settingsString = await AsyncStorage.getItem('settings')
    const settings: Settings = settingsString != null ? JSON.parse(settingsString) : {}

    settings.openFirstTime = false
    await AsyncStorage.setItem('settings', JSON.stringify(settings))
  }

  useEffect(() => {
    setThemeHandler()
    isFirstTime()
  }, [user, colorScheme])

  if (openFirstTime) {
    return (
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>
          {colorScheme == 'light' ? (
            <StatusBar barStyle="dark-content" translucent backgroundColor="transparent"/>
          ) : (
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent"/>
          )}
          <WelcomeStack setOpenFirstTime={setOpenFirstTime} setFalseOpenFirstTime={setFalseOpenFirstTime} />
        </NavigationContainer>
      </PaperProvider>
    )
  }

  if (user == null) return <SignInScreen />

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>
          {colorScheme == 'light' ? (
            <StatusBar barStyle="dark-content" translucent backgroundColor="transparent"/>
          ) : (
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent"/>
          )}
          <AppStack />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
)
}

export default Router