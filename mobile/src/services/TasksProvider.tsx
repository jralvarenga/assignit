import React, { createContext, useContext, useEffect, useState } from 'react'
import { Task } from '../interface/interfaces'
import auth from '@react-native-firebase/auth'
import { getTasks } from '../lib/tasksLib'

const TasksContext = createContext({})

export const TasksProvider = ({ children }: any) => {
  const user = auth().currentUser
  const [tasks, setTasks] = useState<Task[]>([])
  const [render, setRender] = useState(0)

  const getTasksHandler = async() => {
    const data: Task[] = await getTasks(user)
    setTasks(data)
  }

  useEffect(() => {
    getTasksHandler()
  }, [user, render])

  return (
    <TasksContext.Provider value={{ tasks, setTasks, setRender, render }}>
      {children}
    </TasksContext.Provider>
  )
}

export const useTasks = () => useContext(TasksContext)