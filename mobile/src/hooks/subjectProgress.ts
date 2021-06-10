import { Subject } from '../interface/interfaces'

export const removeSubjectProgress = (subject: Subject) => {
  const progress = subject.progress!
  const currentAssigments: number = subject.assignments!.length - 1

  const getProgress = currentAssigments / progress.total
  const newProgress = 1 - getProgress

  return { progress: newProgress, total: progress.total }
}

export const addSubjectProgress = (subject: Subject, addedAssigments: number) => {
  const currentAssigments = subject.assignments?.length! + addedAssigments
  const newTotal: number = subject.progress!.total + addedAssigments

  const getProgress = currentAssigments / newTotal
  const newProgress = 1 - getProgress

  return { progress: newProgress, total: newTotal }
}