import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native'
import auth from '@react-native-firebase/auth'
import { Avatar, Button, Portal, Dialog, Switch, TouchableRipple, Text, useTheme } from 'react-native-paper'
import { deleteAccount, getUserProvider, signIn } from '../lib/auth'
import GoogleLogo from '../assets/icons/google_icon.svg'
import FacebookLogo from '../assets/icons/facebook_icon.svg'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { FirebaseError, Settings, SubjectProvider } from '../interface/interfaces'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { deleteCalendar } from '../lib/calendar'
import { deleteUserDocument } from '../lib/firestore'
import { useAuth } from '../services/AuthProvider'
import { LoginManager as FacebookLoginManager, AccessToken as FacebookAccessToken } from 'react-native-fbsdk-next'
import { useSubjectProvider } from '../services/SubjectsProvider'
import { useTranslation } from 'react-i18next'
import AppSnackbar from '../components/Snackbar'

const AccountScreen = ({ navigation }: any) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const styles = styleSheet(theme)
  const user: any = auth().currentUser
  const provider = getUserProvider()
  const { setUser }: any = useAuth()
  const { subjects }: SubjectProvider = useSubjectProvider()
  const [googleSync, setGoogleSync] = useState( provider == 'google.com' ? true : false )
  const [showDeleteAccount, setShowDeleteAccount] = useState(false)
  const [deleteAccountLoading, setDeleteAccountLoading] = useState(false)
  const [snackbarText, setSnackbarText] = useState("")
  const [showSnackbar, setShowSnackbar] = useState(false)

  const getSettings = async() => {
    const stringSettings = await AsyncStorage.getItem('settings')
    const settings: Settings = JSON.parse(stringSettings!)
    setGoogleSync(settings.googleCalendarSync!)
  }

  useEffect(() => {
    getSettings()
  }, [user])

  /*const changeGoogleSync = async () => {
    const stringSettings = await AsyncStorage.getItem('settings')
    const settings: Settings = JSON.parse(stringSettings!)
    settings.googleCalendarSync = !googleSync
    await AsyncStorage.setItem('settings', JSON.stringify(settings))
    setGoogleSync(!googleSync)
  }*/

  const deleteAccountHandler = async() => {
    setDeleteAccountLoading(true)
    try {
      switch (provider) {
        case 'google.com':
          const { idToken } = await GoogleSignin.signIn()
          const googleUser = await GoogleSignin.getTokens()
          const accessToken = googleUser.accessToken
          const googleCredential = auth.GoogleAuthProvider.credential(idToken)
          await signIn(googleCredential, accessToken, 'google', t)

          if (provider == 'google.com' && googleSync == true) {
            await deleteCalendar(accessToken)
          }
          await GoogleSignin.revokeAccess()
          await GoogleSignin.signOut()
        break
        case 'facebook.com':
          const result = await FacebookLoginManager.logInWithPermissions(["public_profile", "email"])
          if (result.isCancelled) {
            //setError('Cancelled')
            console.log('error');
            return
          }
          const data = await FacebookAccessToken.getCurrentAccessToken()
          if (!data) {
            //setError('Cancelled')
            console.log('error');
            return
          }
          const facebookCredential = auth.FacebookAuthProvider.credential(data!.accessToken)
          await signIn(facebookCredential, data!.accessToken, 'facebook', t)

          FacebookLoginManager.logOut()
        break
      
        default:
        break
      }

      await deleteUserDocument(user, subjects!)
      await deleteAccount()
      setDeleteAccountLoading(false)
      setUser(null)
      navigation.navigate('Sign In')
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.profileContainer}>
        <Avatar.Image size={70} source={{ uri: user?.photoURL }} />
        <Text style={[styles.font, {fontSize: 25}]}>{user.displayName}</Text>
        <Text style={[styles.font, {color: theme.colors.textPaper}]}>
          {user.email}
        </Text>
      </View>

      <View style={styles.infoContainer}>
        <ScrollView style={{ width: '90%' }}>
          {/*provider != 'google.com' && (
            <View style={{ marginBottom: 30 }}>
              <Text style={[styles.font, { textAlign: 'center' }]}>
                {t("Your account doesn't support sync with Google Calendar")}
              </Text>
            </View>
          )*/}
          <View style={[styles.infoRow, {marginTop: 0}]}>
            <Text style={[styles.font, { fontSize: 20 }]}>
              {t("Account provider")}
            </Text>
            {provider == 'facebook.com' ? (
              <FacebookLogo width={40} height={40} />
            ) : (
              <GoogleLogo width={30} height={30} />
            )}
          </View>
          {/*provider == 'google.com' && (
            <View style={styles.infoRow}>
              <Text style={[styles.font, { fontSize: 20 }]}>
                {t("Google Calendar sync")}
              </Text>
              <Switch value={googleSync} onValueChange={changeGoogleSync} />
            </View>
          )*/}
          <TouchableRipple onPress={() => navigation.navigate('Stadistics')} borderless rippleColor={theme.colors.surface} style={[styles.infoRow, {borderRadius: 15 }]}>
            <>
            <Text style={[styles.font, { fontSize: 20 }]}>
              {t("Your stats")}
            </Text>
            <MaterialCommunityIcons name="chart-arc" size={35} color={theme.colors.text} />
            </>
          </TouchableRipple>
          <View style={styles.infoRow}>
            <Text style={[styles.font, { fontSize: 20, color: theme.colors.primary }]}>
              {t("Delete account")}
            </Text>
            <Button
              uppercase={false}
              onPress={() => setShowDeleteAccount(true)}
              mode="contained"
              style={{ elevation: 0, backgroundColor: theme.colors.accent }}
              labelStyle={[styles.font, { color: "#fff", letterSpacing: 0 }]}
            >{t("Delete")}</Button>
          </View>
        </ScrollView>
      </View>

      <Portal>
        <Dialog visible={showDeleteAccount} onDismiss={() => setShowDeleteAccount(false)}>
          <Dialog.Title style={[styles.font, {fontSize: 25, letterSpacing: 0}]}>
            {t("Delete account")}
          </Dialog.Title>
          <Dialog.Content>
            <Text style={[styles.font, {color: theme.colors.textPaper}]}>
              {t("You're about to delete your account")}
            </Text>
            <Text style={[styles.font, {color: theme.colors.textPaper}]}>
              {t("This will delete all your subjects and assignments")}
            </Text>
            <Text style={[styles.font, {color: theme.colors.textPaper}]}>
              {t("Also all your Assignit data in your Google Calendar")}
            </Text>
            <Text style={[styles.font, {color: theme.colors.text, width: '100%', textAlign: 'center'}]}>
              {t("¿Are you sure?")}
            </Text>
            <Text style={[styles.font, {color: theme.colors.textPaper, width: '100%', textAlign: 'center', fontSize: 14}]}>
              {t("You will need to restar the app")}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              uppercase={false}
              style={[styles.actionButtons, {marginLeft: 15}]}
              labelStyle={[styles.font, {fontSize: 16, color: theme.colors.primary, letterSpacing: 0}]}
              onPress={() => setShowDeleteAccount(false)}
            >{t("Cancel")}</Button>
            <Button
              mode="contained"
              uppercase={false}
              style={[styles.actionButtons]}
              loading={deleteAccountLoading}
              labelStyle={[styles.font, { color: theme.colors.background, letterSpacing: 0 }]}
              onPress={deleteAccountHandler}
            >{t("Delete")}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <AppSnackbar
        visible={showSnackbar}
        setVisible={setShowSnackbar}
        text={snackbarText}
      />
    </View>
  )
}

const styleSheet = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  profileContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  font: {
    fontFamily: 'poppins-bold',
    color: theme.colors.text,
    fontSize: 16,
  },
  infoContainer: {
    flex: 5,
    alignItems: 'center',
  },
  infoRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30
  },
  actionButtons: {
    paddingLeft: 10,
    paddingRight: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  }
})

export default AccountScreen