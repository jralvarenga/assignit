import { Task } from "../interface/interfaces";

export const getDoneTasks = (tasks: Task[]) => {
  const done = tasks.map((task) => {
    if (task.done == true) {
      return task
    }
  })

  return done.filter(function (el) {
    return el != null
  })
}

export const getPendingTasks = (tasks: Task[]) => {
  const pending = tasks.map((task) => {
    if (task.done == false) {
      return task
    }
  })

  return pending.filter(function (el) {
    return el != null
  })
}