import AsyncStorage from '@react-native-async-storage/async-storage'
import { Assignment, Subject, UserDoc } from '../interface/interfaces'
import { API_KEY } from '@env'
import { theme } from '../services/theme'
import { cancelNoti } from './notifications'

export const createCalendar = async(accessToken: string) => {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
  const body = {
    summary: 'Assignit'
  }

  const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars?key=${API_KEY}`, {
    method: 'post',
    headers: headers,
    body: JSON.stringify(body),
  })
  const data = await response.json()

  return data
}

export const createEvent = async(accessToken: string, assignment: Assignment, subject: Subject) => {
  const stringUserDoc = await AsyncStorage.getItem('userDoc')
  const userDoc: UserDoc | null = stringUserDoc != null ? JSON.parse(stringUserDoc) : null
  const calendarId = userDoc?.calendarId

  const getYMDDate = (datetime: Date) => {
    const date: string = datetime.getDate() < 10 ? `0${datetime.getDate()}` : `${datetime.getDate()}`
    const month: string = datetime.getMonth() + 1 < 10 ? `0${datetime.getMonth() + 1}` : `${datetime.getMonth() + 1}`
    const year: number = datetime.getFullYear()

    return `${year}-${month}-${date}`
  }

  const startDate = assignment.from
  const endDate = assignment.to
  const start = {
    date: getYMDDate(startDate)
  }
  const end = {
    date: getYMDDate(endDate)
  }
  
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
  const body = {
    start: {
      ...start
    },
    end: {
      ...end
    },
    summary: `${assignment.title} - ${subject.name}`,
    description: assignment.description,
    colorId: subject.color.id,
    reminders: {
      useDefault: false,
      overrides: [
        {method: 'popup', 'minutes': 720},
      ],
    },
  }

  const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${API_KEY}`, {
    method: 'post',
    headers: headers,
    body: JSON.stringify(body),
  })
  const data = await response.json()

  return data
}

export const deleteEvent = async(id: string, accessToken: string,) => {
  const stringUserDoc = await AsyncStorage.getItem('userDoc')
  const userDoc: UserDoc | null = stringUserDoc != null ? JSON.parse(stringUserDoc) : null
  const calendarId = userDoc?.calendarId

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept: 'application/json'
  }
  
  await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${id}?key=${API_KEY}`, {
    method: 'delete',
    headers: headers
  })
}

export const createMarkedCalendar = (assignmentsByDate: any, subjects: Subject[]) => {
  const getSubjectColor = (id: string, subjects: Subject[]) => {
    const index = subjects.map((subject: Subject) => subject.id ).indexOf(id);
    return subjects[index].color.color
  }

  for (const key in assignmentsByDate) {
    const assignmentKeys = assignmentsByDate[key].map((assignment: any) => {
      const color = getSubjectColor(assignment.subject, subjects)
      return {
        key: assignment.title,
        color: color,
        selectedDotColor: color
      }
    })
  assignmentsByDate[key] = { dots: assignmentKeys, selected: true, color: theme.colors.inactivePrimary, selectedColor: theme.colors.inactivePrimary, textColor: 'gray' }
  } 

  return assignmentsByDate
}

export const deleteAllEvent = async(subjects: Subject[], accessToken: string) => {
  const stringUserDoc = await AsyncStorage.getItem('userDoc')
  const userDoc: UserDoc | null = stringUserDoc != null ? JSON.parse(stringUserDoc) : null
  const calendarId = userDoc?.calendarId

  subjects.map(async(subjects) => {
    const assignments = subjects.assignments!

    assignments.map(async(assignment) => {
      // Cancel local notification
      cancelNoti(assignment.notiId)
      const id = assignment.id

      const headers = {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json'
      }
      
      await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${id}?key=${API_KEY}`, {
        method: 'delete',
        headers: headers
      })
    })
  })
}

export const deleteCalendar = async(accessToken: string) => {
  const stringUserDoc = await AsyncStorage.getItem('userDoc')
  const userDoc: UserDoc | null = stringUserDoc != null ? JSON.parse(stringUserDoc) : null
  const calendarId = userDoc?.calendarId

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept: 'application/json'
  }
  await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}?key=${API_KEY}`, {
    headers: headers
  })
}