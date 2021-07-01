import React, { useEffect, useState } from 'react'
import { StyleSheet, View, SafeAreaView, TouchableOpacity } from 'react-native'
import { Avatar, Button, Dialog, Portal, Switch, Text, useTheme } from 'react-native-paper'
import auth from '@react-native-firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { useAuth } from '../services/AuthProvider'
import { deleteAllEvent } from '../lib/calendar'
import { FirebaseError, Settings, SubjectProvider, ThemeProvider } from '../interface/interfaces'
import { useSubjectProvider } from '../services/SubjectsProvider'
import { deleteAllSubjects } from '../lib/firestore'
import AntIcons from 'react-native-vector-icons/AntDesign'
import { cancelAllNotis, cancelNoti, localNoti, repeatNotis } from '../lib/notifications'
import { useUserColorScheme } from '../services/ThemeProvider'
import { useTranslation } from 'react-i18next'
import AppSnackbar from '../components/Snackbar'
import { Item } from 'react-native-paper/lib/typescript/components/List/List'

const SettingsScreen = ({ navigation }: any) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const styles = styleSheet(theme)
  const user: any = auth().currentUser
  const { setUser }: any = useAuth()
  const { colorScheme, setColorScheme }: ThemeProvider = useUserColorScheme()
  const { subjects, render, setRender }: SubjectProvider = useSubjectProvider()
  const [showDeleteAllSubjects, setShowDeleteAllSubjects] = useState(false)
  const [showTheme, setShowTheme] = useState(false)
  const [isDarkTheme, setIsDarkTheme] = useState( colorScheme == 'dark' ? true : false )
  const [loadDeleteSubjects, setLoadDeleteSubjects] = useState(false)
  const [showNotiSettings, setShowNotiSettings] = useState(false)
  const [weekReminder, setWeekReminder] = useState<boolean>()
  const [settings, setSettings] = useState<Settings>()
  const [snackbarText, setSnackbarText] = useState("")
  const [showSnackbar, setShowSnackbar] = useState(false)

  const getSettings = async() => {
    const stringSettings: string | null = await AsyncStorage.getItem('settings')
    const settings: Settings = JSON.parse(stringSettings!)
    setSettings(settings)
    setWeekReminder(settings.weekReminder)
    
  }

  useEffect(() => {
    getSettings()
  }, [user])

  const signOut = async() => {
    try {
      cancelAllNotis()
      await AsyncStorage.removeItem('userDoc')
      await GoogleSignin.signOut()
      await auth().signOut()
      navigation.navigate('Sign In')
      setUser(null)
    } catch (e: any) {
      const error: FirebaseError = e
      if (error.message) {
        setSnackbarText(error.message)
        setShowSnackbar(true)
      } else {
        setSnackbarText(JSON.stringify(error))
        setShowSnackbar(true)
      }
    }
  }

  const deleteAllSubjectsHandler = async() => {
    setLoadDeleteSubjects(true)
    try {
      const googleUser = await GoogleSignin.getTokens()
      const accessToken = googleUser.accessToken

      await deleteAllEvent(subjects!, accessToken)   
      await deleteAllSubjects(subjects!, user)
      setLoadDeleteSubjects(false)
      setShowDeleteAllSubjects(false)
      setRender!(render! + 1)
    } catch (e: any) {
      const error: FirebaseError = e
      if (error.message) {
        setSnackbarText(error.message)
        setShowSnackbar(true)
      } else {
        setSnackbarText(JSON.stringify(error))
        setShowSnackbar(true)
      }
    }
  }

  const testNoti = () => {    
    localNoti()
  }

  const removeWeekReminder = async() => {
    switch (weekReminder) {
      case true:
        settings!.weekReminder = false
        cancelNoti(settings!.reminderNotiId!)
        setWeekReminder(false)
        setSettings(settings)
      break;
      case false:
        settings!.weekReminder = true
        const notiId = repeatNotis(t)
        settings!.reminderNotiId = notiId
        setWeekReminder(true)
        setSettings(settings)
      break;
      default:
      break;
    }
    await AsyncStorage.setItem('settings', JSON.stringify(settings))
  }

  const changeThemeHandler = async() => {
    settings!.colorScheme = colorScheme == 'dark' ? 'light' : 'dark'
    setColorScheme!( colorScheme == 'dark' ? 'light' : 'dark' )
    setIsDarkTheme(!isDarkTheme)
    await AsyncStorage.setItem('settings', JSON.stringify(settings))
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Account')} style={styles.profileContainer}>
        <Avatar.Image style={styles.profilePic} size={70} source={{ uri: user?.photoURL }} />
        <View>
          <Text style={styles.userName}>{user?.displayName}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>
        <View style={{ display: 'flex', marginLeft: 'auto', alignItems: 'center', justifyContent: 'center', marginRight: 20 }}>
          <AntIcons name="arrowup" size={30} color={theme.colors.text} />
        </View>
      </TouchableOpacity>
      <View style={styles.actionsContainer}>
        <View style={{ width: '95%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => navigation.navigate('New Subject')} activeOpacity={0.7} style={styles.actionBox}>
            <Text style={[styles.font, {fontSize: 20}]}>{t("Create subject")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Stadistics')} activeOpacity={0.7} style={styles.actionBox}>
            <Text style={[styles.font, {fontSize: 20}]}>{t("Stadistics")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowTheme(true)} activeOpacity={0.7} style={styles.actionBox}>
            <Text style={[styles.font, {fontSize: 20}]}>{t("Theme")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowNotiSettings(true)} activeOpacity={0.7} style={styles.actionBox}>
            <Text style={[styles.font, {fontSize: 20}]}>{t("Notifications")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowDeleteAllSubjects(true)} activeOpacity={0.7} style={styles.actionBox}>
            <Text style={[styles.font, {fontSize: 20}]}>{t("Delete all subjects")}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.signOutContainer}>
        <Button
          style={styles.signOutButton}
          mode="contained"
          onPress={signOut}
          uppercase={false}
          labelStyle={styles.singOutLabel}
        >
          {t("Sign out")}
        </Button>
      </View>

      { /* Notifications settings */ }
      <Portal>
        <Dialog visible={showTheme} onDismiss={() => setShowTheme(false)}>
          <Dialog.Title style={[styles.font, {fontSize: 25, letterSpacing: 0}]}>
            {t("Theme")}
          </Dialog.Title>
          <Dialog.Content>
            <TouchableOpacity onPress={testNoti} activeOpacity={0.7}>
              <Text style={[styles.font, { textAlign: 'center' }]}>
                {t('Color scheme', { color: colorScheme })}
              </Text>
            </TouchableOpacity>
            <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 }}>
              <Text style={styles.font}>
                Dark theme
              </Text>
              <Switch
                theme={{ colors: { primary: theme.colors.accent } }}
                value={isDarkTheme}
                onValueChange={changeThemeHandler}
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              uppercase={false}
              style={[styles.actionButtons]}
              labelStyle={[styles.font, {fontSize: 16, color: theme.colors.primary, letterSpacing: 0}]}
              onPress={() => setShowTheme(false)}
            >Ok</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      { /* Notifications settings */ }
      <Portal>
        <Dialog visible={showNotiSettings} onDismiss={() => setShowNotiSettings(false)}>
          <Dialog.Title style={[styles.font, {fontSize: 25, letterSpacing: 0}]}>
            {t("Notifications")}
          </Dialog.Title>
          <Dialog.Content>
            <TouchableOpacity onPress={testNoti} activeOpacity={0.7}>
              <Text style={[styles.font, { textAlign: 'center' }]}>
                {t("Test notification")}
              </Text>
            </TouchableOpacity>
            <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 }}>
              <Text style={styles.font}>
                {t("Reminder every week")}
              </Text>
              <Switch
                theme={{ colors: { primary: theme.colors.accent } }}
                value={weekReminder!}
                onValueChange={removeWeekReminder}
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              uppercase={false}
              style={[styles.actionButtons]}
              labelStyle={[styles.font, { color: theme.colors.primary, letterSpacing: 0}]}
              onPress={() => setShowNotiSettings(false)}
            >Ok</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      { /* Delete all subjects */ }
      <Portal>
        <Dialog visible={showDeleteAllSubjects} onDismiss={() => setShowDeleteAllSubjects(false)}>
          <Dialog.Title style={[styles.font, {fontSize: 25, letterSpacing: 0}]}>
            {t("Delete all subjects")}
          </Dialog.Title>
          <Dialog.Content>
            <Text style={[styles.font, {color: theme.colors.textPaper}]}>
              {t("You're about to delete all your Subjects, are you sure?")}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              uppercase={false}
              style={[styles.actionButtons, {marginLeft: 15}]}
              labelStyle={[styles.font, { color: theme.colors.primary, letterSpacing: 0}]}
              onPress={() => setShowDeleteAllSubjects(false)}
            >{t("Cancel")}</Button>
            <Button
              mode="contained"
              uppercase={false}
              style={[styles.actionButtons]}
              loading={loadDeleteSubjects}
              labelStyle={[styles.font, { color: theme.colors.background, letterSpacing: 0}]}
              onPress={deleteAllSubjectsHandler}
            >{t("Delete")}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <AppSnackbar
        visible={showSnackbar}
        setVisible={setShowSnackbar}
        text={snackbarText}
      />
    </SafeAreaView>
  )
}

const styleSheet = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    flex: 2.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    marginLeft: '3%',
    marginRight: 15
  },
  userName: {
    fontFamily: 'poppins-bold',
    color: theme.colors.text,
    fontSize: 28,
  },
  userEmail: {
    fontFamily: 'poppins-bold',
    color: theme.colors.textPaper,
    marginTop: -5,
    fontSize: 14
  },
  actionsContainer: {
    flex: 5,
    alignItems: 'center'
  },
  actionBox: {
    width: '47%',
    //height: 130,
    backgroundColor: theme.colors.surface,
    marginBottom: 15,
    borderRadius: 15,
    padding: 20
  },
  signOutContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  font: {
    fontFamily: 'poppins-bold',
    color: theme.colors.text,
    fontSize: 16
  },
  signOutButton: {
    padding: 5,
    paddingLeft: 15,
    paddingRight: 15,
    marginRight: '3%',
    marginBottom: '5%',
    elevation: 0
  },
  singOutLabel: {
    fontFamily: 'poppins-bold',
    color: theme.colors.background,
    fontSize: 16,
    letterSpacing: 0
  },
  actionButtons: {
    paddingLeft: 15,
    paddingRight: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  }
})

export default SettingsScreen