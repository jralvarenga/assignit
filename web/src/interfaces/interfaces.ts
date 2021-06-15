import firebase from '../firebase/config'

type User = firebase.User

export interface AuthProvider {
  user?: User | null
  setUser?: Function
}