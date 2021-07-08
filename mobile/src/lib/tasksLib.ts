import firestore from '@react-native-firebase/firestore'
import { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { Task } from '../interface/interfaces'
import { reminderNoti } from './notifications'

export const getTasks = async(user: FirebaseAuthTypes.User | null) => {
  const tasksRef = firestore().collection('data').doc(user?.uid).collection('tasks')

  let tasks: any = []
  const getSubjectsInfo = await tasksRef.get()

  getSubjectsInfo.forEach((doc) => {
    const data = doc.data()
    if (data.setTo) {
      data.setTo = data.setTo.toDate()
    }
    if (data.doneDate) {
      data.doneDate = data.doneDate.toDate()  
    }
    if (data.repeatDate) {
      data.repeatDate = data.repeatDate.toDate()  
    }

    tasks.push(doc.data())
  })

  return tasks
}

export const addNewTask = async(task: Task, user: FirebaseAuthTypes.User | null) => {
  const tasksRef = firestore().collection('data').doc(user?.uid).collection('tasks').doc(task.id)

  await tasksRef.set({
    ...task
  })
}

export const setTaskStatus = async(taskId: string, state: boolean, user: FirebaseAuthTypes.User | null) => {
  const tasksRef = firestore().collection('data').doc(user?.uid).collection('tasks').doc(taskId)

  await tasksRef.update({
    done: state,
    doneDate: state == true ? new Date() : undefined
  })
}

export const setNewRepeatDate = async(taskId: string, user: FirebaseAuthTypes.User | null) => {
  const currentDate = new Date()
  currentDate.setMinutes( currentDate.getMinutes() + currentDate.getTimezoneOffset() )
  const tasksRef = firestore().collection('data').doc(user?.uid).collection('tasks').doc(taskId)

  await tasksRef.update({
    repeatDate: currentDate
  })
}

export const deleteTask = async(taskId: string, user: FirebaseAuthTypes.User | null) => {
  const tasksRef = firestore().collection('data').doc(user?.uid).collection('tasks').doc(taskId)

  await tasksRef.delete()
}

export const filterTasks = (tasks: Task[], user: FirebaseAuthTypes.User | null) => {
  const currentDate = new Date()
  let pending: any[] = []
  let done: any[] = []

  tasks.map((task) => {
    if (task.done == true) {
      if (task.repeat) {
        const getDiff = currentDate.getTime() - task.repeatDate!.getTime()
        if (getDiff > task.repeat) {
          task.done = false
          setTaskStatus(task.id, false, user)
          pending.push(task)
          return
        }
      }
      done.push(task)
    } else {
      pending.push(task)
    }
  })

  const filterPending: Task[] = pending.filter((el) => {
    return el != null
  })
  const filterDone: Task[] = done.filter((el) => {
    return el != null
  })

  return [filterPending, filterDone]
}

export const setTaskRepeater = (reminderType: string, task: Task, translator: Function) => {

  const getRemindDate = (reminderType: string, date: Date): Date => {
    date.setMinutes( date.getMinutes() + date.getTimezoneOffset() )
    switch (reminderType) {
      case 'Hour':
        date.setMinutes(0, 0, 0)
      break
      case 'Day':
      case 'Week':
      case 'Month':
        date.setHours(0, 0, 0)
      break
    }
    return date
  }
  
  const getReminderTime = (reminderType: string) => {
    switch (reminderType) {
      case 'Hour':
        return 3600000
      case 'Day':
        return 86400000
      case 'Week':
        return 604800000
      case 'Month':
        return  2592000000
      default:
        return 0
    }
  }
  const remindDate: Date = getRemindDate(reminderType, new Date())
  const reminderTime: number = getReminderTime(reminderType)
  console.log(reminderTime)

  const notiBody = {
    title: `${task.title}`,
    body: translator(`You have a reminder for this task`),
    date: remindDate
  }

  const id = reminderNoti(reminderTime, notiBody)
  return id
}