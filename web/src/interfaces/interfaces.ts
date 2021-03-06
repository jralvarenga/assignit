import firebase from '../firebase/config'

type User = firebase.User

export interface AuthProvider {
  user?: User | null
  setUser?: Function
}

export interface Assignment {
  title: string
  subject: string,
  description: string,
  id: string,
  from: Date,
  to: Date,
  notiId: number
}

export interface Subject {
  id: string,
  name: string,
  color: {
    id: string,
    color: string
  },
  progress?: {
    total: number,
    progress: number
  }
  assignments?: Assignment[],
  reunion?: string,
  link?: string
}

export interface SubjectProvider {
  loading?: boolean,
  subjects?: Subject[],
  render?: number,
  setRender?: Function,
  refreshSubjects?: Function
}

export interface UserDoc {
  uid: string,
  calendarId: string,
  calendarName: string,
}

export interface Color {
  id: string,
  background: string,
  foreground: string
}

export interface Settings {
  openFirstTime?: boolean,
  googleCalendarSync?: boolean,
  weekReminder?: boolean,
  reminderNotiId?: number,
  colorScheme?: string
}

export interface ThemeProvider {
  colorScheme?: string,
  setColorScheme?: Function
}