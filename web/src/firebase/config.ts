import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCL5O-GXC9tkzJ37KSDPPMteqwPtmw-sjM",
  authDomain: "assignit-81b17.firebaseapp.com",
  projectId: "assignit-81b17",
  storageBucket: "assignit-81b17.appspot.com",
  messagingSenderId: "744064944166",
  appId: "1:744064944166:web:67033a2af98175e6bafee7",
  measurementId: "G-W8HYMY4Y07"
}

if(!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export default firebase