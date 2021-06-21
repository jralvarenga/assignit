import firestore from '@react-native-firebase/firestore'
import { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { Task } from '../interface/interfaces'
import { reminderNoti } from './notifications'

export const getTasks = async(user: FirebaseAuthTypes.User | null) => {
  const tasksRef = firestore().collection('data').doc(user?.uid).collection('tasks')

  let tasks: any = []
  const getSubjectsInfo = await tasksRef.get()

  getSubjectsInfo.forEach((doc) => {
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
    done: state
  })
}

export const deleteTask = async(taskId: string, user: FirebaseAuthTypes.User | null) => {
  const tasksRef = firestore().collection('data').doc(user?.uid).collection('tasks').doc(taskId)

  await tasksRef.delete()
}

export const filterTasks = (tasks: Task[]) => {
  let pending: any[] = []
  let done: any[] = []

  tasks.map((task) => {
    if (task.done == true) {
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

export const setTaskReminder = (reminderType: string, task: Task) => {
  const getReminderTime = (reminderType: string) => {
    switch (reminderType) {
      case 'hour':
        return 3600000
      case 'day':
        return 86400000
      case 'week':
        return 604800000
      case 'month':
        return  2592000000
      default:
        return 0
    }
  }

  const currentDate = new Date()
  currentDate.setHours(0, 0, 0)
  const reminderTime: number = getReminderTime(reminderType)  

  const notiBody = {
    title: 'You have a pending task',
    body: `You have to do ${task.title}`,
    date: currentDate
  }

  //const id = reminderNoti(reminderTime, notiBody)
  const id = 1
  return id
}