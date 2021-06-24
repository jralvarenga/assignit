import { createUserDocument/*, getUserDocument*/ } from './firestore'
import firebase from '../firebase/config'


export const signIn = async(provider: any, type: string) => {
  // Create user
  const currentUser = await firebase.auth().signInWithPopup(provider)
  const isNew: boolean | undefined = currentUser.additionalUserInfo?.isNewUser

  if (isNew) {
    switch (type) {
      case 'google':
        //const calendar = await createCalendar(accessToken!)
        await createUserDocument(currentUser.user!, { id: "", summary: "" })
      break;
      case 'facebook':
        await createUserDocument(currentUser.user!, { id: "", summary: "" })
      break;
    
      default:
        break;
    }

  } else {
    //await getUserDocument(currentUser.user)
  }
}

export const getUserProvider = () => {
  const user = firebase.auth().currentUser
  const providerData = user?.providerData

  let provider = ""
  providerData?.forEach((profile) => {
    provider = profile!.providerId
  })

  return provider
}

export const deleteAccount = async() => {
  const user = firebase.auth().currentUser

  await user?.delete()
}