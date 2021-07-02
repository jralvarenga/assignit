import PushNotification from 'react-native-push-notification'
import auth from '@react-native-firebase/auth'
import { createNotiId } from '../hooks/createId'
import { Assignment, Subject } from '../interface/interfaces'

interface ScheduleNotiProps {
  date: Date,
  body: {
    id: number,
    title: string,
    body: string
  }
}

export const localNoti = () => {
  const user: any = auth().currentUser

  PushNotification.localNotification({
    channelId: "assignit_channel_1",
    largeIcon: "ic_launcher",
    ignoreInForeground: false,
    largeIconUrl: user?.photoURL,
    bigLargeIconUrl: user?.photoURL,
    smallIcon: "ic_notification",
    title: "Assignit",
    message: "Check your assignit, you may have something important this week",
  })
}

export const localProgamableNoti = ({ date, body }: ScheduleNotiProps) => {
  let notiDiff = 86400000
  if (date.getHours() == 0) {
    notiDiff = notiDiff - 32400000
  }
  const user: any = auth().currentUser

  PushNotification.localNotificationSchedule({
    channelId: "assignit_channel_1",
    largeIcon: "ic_launcher",
    ignoreInForeground: false,
    largeIconUrl: user?.photoURL,
    bigLargeIconUrl: user?.photoURL,
    smallIcon: "ic_notification",
    id: body.id,
    title: body.title,
    message: body.body,
    date: new Date(date.getTime() - notiDiff)
  })
}

export const repeatNotis = (translator: Function) => {
  const currentDate = new Date()
  const startWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()))
  startWeek.setHours(9, 0, 0)
  const repeatTime = 604800000

  const user: any = auth().currentUser
  const notiId = createNotiId()

  PushNotification.localNotificationSchedule({
    channelId: "assignit_channel_1",
    id: notiId,
    largeIcon: "ic_launcher",
    ignoreInForeground: false,
    largeIconUrl: user?.photoURL,
    bigLargeIconUrl: user?.photoURL,
    smallIcon: "ic_notification",
    title: "Assignit",
    message: translator("Check your assignit, you may have something important this week"),
    repeatType: 'time',
    repeatTime: repeatTime,
    date: new Date(startWeek.getTime() + repeatTime)
  })
  return notiId
}

export const reminderNoti = (repeatTime: number, body: { title: string, body: string, date: Date }) => {
  const notiId = createNotiId()
  const user: any = auth().currentUser

  PushNotification.localNotificationSchedule({
    channelId: "assignit_channel_1",
    id: notiId,
    largeIcon: "ic_launcher",
    ignoreInForeground: false,
    largeIconUrl: user?.photoURL,
    bigLargeIconUrl: user?.photoURL,
    smallIcon: "ic_notification",
    title: body.title,
    message: body.body,
    repeatType: 'time',
    repeatTime: repeatTime,
    date: new Date(body.date.getTime() + repeatTime)
  })
  return notiId
}

export const existAssignmentNotification = (assignments: Assignment[], subjects: Subject[], translator: Function) => {
  const currentDate = new Date()
  currentDate.setHours(0, 0)
  
  PushNotification.getScheduledLocalNotifications((notis) => {

    assignments.map((assignment) => {
      const notiId = assignment.notiId
      const assgimentsNotiDate = new Date( assignment.from.getTime() - 86400000 )
      assgimentsNotiDate.setHours(0, 0)

      // Checks if assingments is same day (stop notis spam)
      if (currentDate != assgimentsNotiDate && currentDate < assgimentsNotiDate) {
        const index = notis!.map((noti) => +noti.id ).indexOf(notiId)
        const subjectIndex = subjects!.map((subject) => subject.id ).indexOf(assignment.subject)
        if (index == -1) {
          const body: ScheduleNotiProps = {
            date: assignment.from,
            body: {
              id: assignment.notiId,
              title: subjects[subjectIndex].name,
              body: translator("Assignment in 24 hours", { assignment: assignment.title })
            }
          }
          localProgamableNoti(body)
        }
      }

    })
  })
}

export const cancelNoti = (id: number) => {
  PushNotification.cancelLocalNotifications({id: `${id}`})
}

export const cancelAllNotis = () => {
  PushNotification.cancelAllLocalNotifications()
}