import React from 'react'
import { AnimatedTabBarNavigator } from 'react-native-animated-nav-tab-bar'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import HomeScreen from '../pages/Home'
import SettingsScreen from '../pages/Settings'
import AgendaScreen from '../pages/Agenda'
import { useTheme } from 'react-native-paper'
import { useTranslation } from 'react-i18next'
import ToDoListScreen from '../pages/ToDoList'

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

export default BottomTabNavigator