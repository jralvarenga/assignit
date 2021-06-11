import 'react-native-gesture-handler'
import React, { useEffect } from 'react'
import '@react-native-firebase/app'
import { LogBox } from 'react-native'
import Router from './src/services/Router'
import { AuthProvider } from './src/services/AuthProvider'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { SubjectProvider } from './src/services/SubjectsProvider'
import SplashScreen from 'react-native-splash-screen'
import { ThemeProvider } from './src/services/ThemeProvider'

import firestore from '@react-native-firebase/firestore'
firestore().settings({ host: 'localhost:8080', ssl: false })

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
])

GoogleSignin.configure({
  webClientId: '744064944166-cqk42f8mt528frkolhkf4qidn3t3dqr7.apps.googleusercontent.com',
  scopes: [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
  ],
  offlineAccess: true,
})

const App = () => {

  useEffect(() => {
    SplashScreen.hide()
  }, [])

  return (
    <AuthProvider>
      <ThemeProvider>
        <SubjectProvider>
          <Router />
        </SubjectProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
