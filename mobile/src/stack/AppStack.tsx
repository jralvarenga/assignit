import React from 'react'
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import { AnimatedTabBarNavigator } from 'react-native-animated-nav-tab-bar'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import HomeScreen from '../pages/Home'
import SettingsScreen from '../pages/Settings'
import SignInScreen from '../pages/SignIn'
import CreateSubjectScreen from '../pages/CreateSubject'
import SubjectScreen from '../pages/Subject'
import NewSubjectScreen from '../pages/NewSubject'
import AddAssignmentsScreen from '../pages/AddAssignments'
import NewAssigmentScreen from '../pages/NewAssigment'
import AssignmentScreen from '../pages/Assignment'
import StadisticsScreen from '../pages/Stadistics'
import AgendaScreen from '../pages/Agenda'
import AccountScreen from '../pages/Account'
import { useTheme } from 'react-native-paper'
import { useTranslation } from 'react-i18next'
import ToDoListScreen from '../pages/ToDoList'
import CreateNewTask from '../pages/CreateNewTask'

const Stack = createStackNavigator()
const Tab = AnimatedTabBarNavigator()

const BottomTabNavigator = () => {
  const { t } = useTranslation()
  const theme = useTheme()

    return (
    <Tab.Navigator
      appearance={{
        shadow: true,
        activeTabBackgrounds: theme.colors.inactivePrimary,
        tabBarBackground: theme.colors.background
      }}
      tabBarOptions={{
        activeTintColor: theme.colors.primary,
        inactiveTintColor: theme.colors.textPaper,
        labelStyle: {
          fontFamily: 'poppins-semibold'
        }
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: t("Home"),
          tabBarIcon: ({ focused, color }: any) => (
            <MaterialIcon name="home" size={25} color={focused ? color : theme.colors.textPaper} />
          ),
        }}
      />
      <Tab.Screen
        name="Agenda"
        component={AgendaScreen}
        options={{
          title: t("Agenda"),
          tabBarIcon: ({ focused, color }: any) => (
            <MaterialIcon name="calendar-month" size={25} color={focused ? color : theme.colors.textPaper}
            />
          )
        }}
      />
      <Tab.Screen
        name="ToDo"
        component={ToDoListScreen}
        options={{
          title: t("To Do"),
          tabBarIcon: ({ focused, color }: any) => (
            <MaterialIcon name="format-list-checks" size={25} color={focused ? color : theme.colors.textPaper}
            />
          )
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: t("Settings"),
          tabBarIcon: ({ focused, color }: any) => (
            <FontAwesome name="gear" size={25} color={focused ? color : theme.colors.textPaper}
            />
          )
        }}
      />
    </Tab.Navigator>
  )
}
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
          headerShown: true,
          headerLeft: () => null,
          headerTitleStyle: { ...headerTitleStyle },
          gestureEnabled: true,
          ...TransitionPresets.ModalPresentationIOS
        }}
      />
    </Stack.Navigator>
  )
}

export default AppStack