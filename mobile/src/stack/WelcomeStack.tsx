import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import React from 'react'
import WelcomeIndex from '../pages/welcome/WelcomeIndex'

const Stack = createStackNavigator()

interface WelcomeScreenProps {
  setOpenFirstTime: Function,
  setFalseOpenFirstTime?: Function
}

const WelcomeStack = ({ setOpenFirstTime, setFalseOpenFirstTime }: WelcomeScreenProps) => {

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardOverlayEnabled: true,
        ...TransitionPresets.SlideFromRightIOS
      }}
    >
      <Stack.Screen name="Welcome">
        {() => <WelcomeIndex setOpenFirstTime={setOpenFirstTime} setFalseOpenFirstTime={setFalseOpenFirstTime} />}
      </Stack.Screen>
    </Stack.Navigator>
  )
}

export default WelcomeStack