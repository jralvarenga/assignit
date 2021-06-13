import { createCalendar } from './calendar'
import { createUserDocument, getUserDocument } from './firestore'
import auth from '@react-native-firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { repeatNotis } from './notifications'

export const signIn = async(credential: any, accessToken: string | null, type: string, translator: Function) => {
  // Create user
  const currentUser = await auth().signInWithCredential(credential)
  const isNew: boolean | undefined = currentUser.additionalUserInfo?.isNewUser

  if (isNew) {
    switch (type) {
      case 'google':
        //const calendar = await createCalendar(accessToken!)
        await createUserDocument(currentUser.user, { id: "", sumary: "" })
        const notiId1 = repeatNotis(translator)
        const settingsTrue = {
          googleCalendarSync: true,
          weekReminder: true,
          reminderNotiId: notiId1
        }
        await AsyncStorage.setItem('settings', JSON.stringify(settingsTrue))
      break;
      case 'facebook':
        await createUserDocument(currentUser.user, { id: "", sumary: "" })
        const notiId2 = repeatNotis(translator)
        const settingsFalse = {
          googleCalendarSync: false,
          weekReminder: true,
          reminderNotiId: notiId2
        }
        await AsyncStorage.setItem('settings', JSON.stringify(settingsFalse))
      break;
    
      default:
        break;
    }

  } else {
    await getUserDocument(currentUser.user)
    const notiId = repeatNotis(translator)
    const settingsTrue = {
      googleCalendarSync: true,
      weekReminder: true,
      reminderNotiId: notiId
    }
    await AsyncStorage.setItem('settings', JSON.stringify(settingsTrue))
  }
}

export const getUserProvider = () => {
  const user = auth().currentUser
  const providerData = user?.providerData

  let provider = ""
  providerData?.forEach((profile) => {
    provider = profile.providerId
  })

  return provider
}

export const deleteAccount = async() => {
  const user = auth().currentUser

  await user?.delete()
}