import { Subject } from '../interface/interfaces'

export const globalDistribution = (subjects: Subject[]) => {
  const progressPorcentage = subjects.map((subject) => {
    return {
      id: subject.id,
      name: subject.name,
      progress: subject.progress?.progress,
      total: subject.progress?.total,
      color: subject.color.color
    }
  })

  return progressPorcentage
}

export const pieData = (arr: any[]) => {
  const names =  arr.map((subject: any) => subject.name)
  const progress = arr.map((subject: any) => subject.progress)
  return {
    labels: names,
    data: progress
  }
}

export const countAssignments = (arr: Subject[]) => {
  const singleTotal = arr.map((subject) => subject.assignments?.length)
  const total = singleTotal.reduce((a: number, b: any) => a + b, 0)

  return total
}