import AsyncStorage from '@react-native-async-storage/async-storage'
import { FirebaseAuthTypes } from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { Assignment, Subject, UserDoc } from '../interface/interfaces'

export const createUserDocument = async(user: FirebaseAuthTypes.User, calendar: any) => {
  const userDoc: UserDoc = {
    uid: user.uid,
    calendarId: calendar.id,
    calendarName: calendar.summary,
  }

  await firestore().collection('data').doc(user.uid).set({
    ...userDoc,
  })
  await AsyncStorage.setItem('userDoc', JSON.stringify(userDoc))

  return userDoc
}

export const getUserDocument = async(user: FirebaseAuthTypes.User) => {
  const userDoc = firestore().collection('data').doc(user.uid)
  const doc = await userDoc.get()
  const data = doc.data()
  
  await AsyncStorage.setItem('userDoc', JSON.stringify(data))
}

export const createSubject = async(subject: Subject, user: FirebaseAuthTypes.User | null) => {
  const batch = firestore().batch()
  const collectionRef = firestore().collection('data').doc(user?.uid).collection(subject.id)
  const subjectsInfoRef = firestore().collection('data').doc(user?.uid).collection('subjectsInfo').doc(subject.id)
  const assigments = subject.assignments!

  // Add subject to user
  const newSubject: Subject = {
    name: subject.name,
    id: subject.id,
    color: subject.color,
    progress: subject.progress!,
    link: subject.link!,
    reunion: subject.reunion!
  }
  await subjectsInfoRef.set({
    ...newSubject
  })

  // Add Assigment to collection
  assigments.map( async(assigment: Assignment) => {
    const doc = {
      ...assigment
    }
    const ref = collectionRef.doc(assigment.id)
    batch.set(ref, doc)
  })

  batch.commit()

  return 'done'
}


export const getSubjects = async(user: FirebaseAuthTypes.User | null) => {
  //const userRef = firestore().collection('data').doc(user?.uid)
  const subjectsInfoRef = firestore().collection('data').doc(user?.uid).collection('subjectsInfo')

  let subjects: any = []
  const getSubjectsInfo = await subjectsInfoRef.get()

  getSubjectsInfo.forEach((doc) => {
    subjects.push(doc.data())
  })

  return subjects
}

export const updateProgress = async(subject: Subject, user: FirebaseAuthTypes.User | null) => {
  const subjectDoc = firestore().collection('data').doc(user?.uid).collection('subjectsInfo').doc(subject.id)

  await subjectDoc.update({
    progress: subject.progress
  })
}

export const getAssigments = async(user: FirebaseAuthTypes.User | null, subject: Subject[]) => {
  const subjectsId = subject.map((subject: Subject) => subject.id)

  let assigments = []

  for (let n = 0; n < subjectsId.length; n++) {
    const id = subjectsId[n]

    const snapshot = await firestore().collection('data').doc(user?.uid).collection(id).get()

    const assigmentDocs = snapshot.docs.map((doc) => {
      const data = doc.data()
      data.from = data.from.toDate()
      data.to = data.to.toDate()
      
      return data
    })
    assigments.push(...assigmentDocs)
  }

  return assigments
}

export const addNewAssigments = async(subject: Subject, newAssigments: Assignment[], user: FirebaseAuthTypes.User | null) => {
  const batch = firestore().batch()
  const collectionRef = firestore().collection('data').doc(user?.uid).collection(subject.id)

  // Add Assigment to collection
  newAssigments.map( async(assigment: Assignment) => {
    const doc = {
      ...assigment
    }
    const ref = collectionRef.doc(assigment.id)
    batch.set(ref, doc)
  })

  batch.commit()
}

export const changeLinks = async(subject: Subject, user: FirebaseAuthTypes.User | null, type: string, link: string) => {
  const subjectDoc = firestore().collection('data').doc(user?.uid).collection('subjectsInfo').doc(subject.id)
  switch (type) {
    case 'link':
      await subjectDoc.update({
        link: link
      })
    break
    case 'reunion':
      await subjectDoc.update({
        reunion: link
      })      
    break  
    default:
    break
  }
}

export const deleteAssigment = async(id: string, user: FirebaseAuthTypes.User | null, subject: Subject) => {
  const docRef = firestore().collection('data').doc(user?.uid).collection(subject.id).doc(id)

  await docRef.delete()
}

export const deleteSubject = async(subject: Subject, user: FirebaseAuthTypes.User | null) => {
  const batch = firestore().batch()
  const collectionRef = firestore().collection('data').doc(user?.uid).collection(subject.id)
  const subjectDoc = firestore().collection('data').doc(user?.uid).collection('subjectsInfo').doc(subject.id)
  const assigments = subject.assignments!

  assigments.map(async(assigment: Assignment) => {
    const ref = collectionRef.doc(assigment.id)

    batch.delete(ref)
  })
  batch.commit()

  await subjectDoc.delete()
}


export const deleteAllSubjects = async(subjects: Subject[], user: FirebaseAuthTypes.User | null) => {
  const batch = firestore().batch()
  const userDoc = firestore().collection('data').doc(user?.uid)

  subjects.map(async(subject) => {
    const subjectCollection = userDoc.collection(subject.id)
    const infoDoc = userDoc.collection('subjectsInfo').doc(subject.id)
    const assigments = subject.assignments!

    assigments.map(async(assigment: Assignment) => {
      const ref = subjectCollection.doc(assigment.id)
  
      batch.delete(ref)
    })

    await infoDoc.delete()
  })

  batch.commit()
}

export const deleteUserDocument = async(user: FirebaseAuthTypes.User | null, subjects: Subject[]) => {
  await deleteAllSubjects(subjects, user)
  const userDoc = firestore().collection('data').doc(user?.uid)

  await userDoc.delete()
}