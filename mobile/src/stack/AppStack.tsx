import React from 'react'
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import SignInScreen from '../pages/SignIn'
import CreateSubjectScreen from '../pages/CreateSubject'
import SubjectScreen from '../pages/Subject'
import NewSubjectScreen from '../pages/NewSubject'
import AddAssignmentsScreen from '../pages/AddAssignments'
import NewAssigmentScreen from '../pages/NewAssigment'
import AssignmentScreen from '../pages/Assignment'
import StadisticsScreen from '../pages/Stadistics'
import AccountScreen from '../pages/Account'
import { useTheme } from 'react-native-paper'
import { useTranslation } from 'react-i18next'
import CreateNewTask from '../pages/CreateNewTask'
import BottomTabNavigator from './BottomTabStack'

const Stack = createStackNavigator()

const AppStack = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const height120 = insets.top + 80

  const headerStyle = {
    backgroundColor: theme.colors.background,
    height: height120
  }

  const headerTitleStyle = {
    fontFamily: 'poppins-bold',
    fontSize: 28,
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { ...headerStyle },
        headerTitleStyle: {
          fontFamily: 'poppins-bold',
          color: theme.colors.text,
          fontSize: 28
        },
        //gestureEnabled: true,
        cardOverlayEnabled: true,
        ...TransitionPresets.SlideFromRightIOS
      }}
      mode="modal"
    >
      {/* Home with bottom navigator (Home, Calendar, Settings) */}
      <Stack.Screen
        name="Home"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />

      {/* Sign in screen */}
      <Stack.Screen
        name="Sign In"
        component={SignInScreen}
        options={{ headerShown: false }}
      />
      
      {/* New Subject screen */}
      <Stack.Screen
        name="New Subject"
        component={NewSubjectScreen}
        options={{
          title: t("New Subject")!,
        }}
      />

      {/* Stadistics screen */}
      <Stack.Screen
        name="Stadistics"
        component={StadisticsScreen}
        options={{
          title: t("Stadistics")!,
        }}
      />

      <Stack.Screen
        name="Add Assignments"
        options={({ route }: any) => ({
          title: route.params.name,
          headerTitleStyle: {
            ...headerTitleStyle,
            color: route.params.color.color,
          },
        })}
        component={AddAssignmentsScreen}
      />

      <Stack.Screen
        name="Subject"
        options={({ route }: any) => ({
          title: route.params.name,
          headerTitleStyle: {
            ...headerTitleStyle,
            color: route.params.color.color,
          },
        })}
        component={SubjectScreen}
      />

      <Stack.Screen
        name="Assignment"
        options={() => ({
          headerShown: false,
          gestureEnabled: true,
          ...TransitionPresets.ModalPresentationIOS
        })}
        component={AssignmentScreen}
      />

      <Stack.Screen
        name="New Assigment"
        options={({ route }: any) => ({
          title: route.params.name,
          headerTitleStyle: {
            ...headerTitleStyle,
            color: route.params.color.color,
          },
          gestureEnabled: true,
          ...TransitionPresets.FadeFromBottomAndroid
        })}
        component={NewAssigmentScreen}
      />

      <Stack.Screen
        name="Create Subject"
        options={({ route }: any) => ({
          title: t("Create Subject")!,
          headerTitleStyle: {
            ...headerTitleStyle,
            color: route.params.color.color,
          },
        })}
        component={CreateSubjectScreen}
      />

      {/* Account screen */}
      <Stack.Screen
        name="Account"
        component={AccountScreen}
        options={{
          headerShown: false,
          gestureEnabled: true,
          ...TransitionPresets.ModalPresentationIOS
        }}
      />

      {/* Create task screen */}
      <Stack.Screen
        name="Create task"
        component={CreateNewTask}
        options={{
          title: t('Create task'),
          headerShown: true,
          headerLeft: () => null,
          gestureEnabled: true,
          ...TransitionPresets.ModalPresentationIOS
        }}
      />
    </Stack.Navigator>
  )
}

export default AppStack