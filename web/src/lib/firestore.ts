import firebase from '../firebase/config'
import { UserDoc } from '../interfaces/interfaces'

type UserTypes = firebase.User

export const createUserDocument = async(user: UserTypes, calendar: any) => {
  const userDoc: UserDoc = {
    uid: user.uid,
    calendarId: calendar.id,
    calendarName: calendar.summary,
  }

  await firebase.firestore().collection('data').doc(user.uid).set({
    ...userDoc
  })
}