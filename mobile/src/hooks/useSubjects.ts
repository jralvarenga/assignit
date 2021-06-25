import { useState } from 'react'
import { Subject, Assignment } from '../interface/interfaces'

export const useSubjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [weekAssigments, setWeekAssigments] = useState<Assignment[]>([])
  const [nextWeekAssigments, setNextWeekAssigments] = useState<Assignment[]>([])
  const [pendingAssigments, setPendingAssigments] = useState<Assignment[]>([])

  const setOnlySubjects = (subjects: Subject[]) => {
    const only: any[] = subjects.map((subject: Subject) => {
      return {
        name: subject.name,
        color: subject.color,
        id: subject.id,
        progress: subject.progress,
        link: subject.link,
        reunion: subject.reunion
      }
    })
    setSubjects(only)
  }

  const getWeekNumber = (date: any) => {
    date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay()||7))
    var yearStart: any = new Date(Date.UTC(date.getUTCFullYear(),0,1))
    var weekNo: number = Math.ceil(( ( (date - yearStart) / 86400000) + 1)/7)
    return weekNo
}

  const groupByWeek = (assigments: Assignment[]) => {
    const sortByDay = (a: Assignment, b: Assignment) => {
      if ( a.from.getDay() < b.from.getDay() ){
        return -1;
      }
      if ( a.from.getDay() > b.from.getDay() ){
        return 1;
      }
      return 0;
    }

    const date = new Date()
    const week = getWeekNumber(date)
    const thisWeekArr: any[] = assigments.map((assigment) => {
      const assigmentDate = assigment.from
      const assigmentWeek = getWeekNumber(assigmentDate)
      if (assigmentWeek == week) {
        if (assigmentDate >= date) {
          return assigment
        }
      } else {
        return null
      }
    })
    const pendingWeekArr: any[] = assigments.map((assigment) => {
      const assigmentDate = assigment.from
      const assigmentWeek = getWeekNumber(assigmentDate)
      if (assigmentDate < date && assigmentWeek <= week) {
        return assigment
      } else {
        return null
      }
    })
    const nextWeekArr: any[] = assigments.map((assigment) => {
      const assigmentDate = assigment.from
      const assigmentWeek = getWeekNumber(assigmentDate)
      if (assigmentWeek == week + 1) {
        return assigment
      } else {
        return null
      }
    })
    const filteredThisWeek: Assignment[] = thisWeekArr.filter((el) => {
      return el != null
    })
    const filteredPending: Assignment[] = pendingWeekArr.filter((el) => {
      return el != null
    })
    const filteredNextWeek: Assignment[] = nextWeekArr.filter((el) => {
      return el != null
    })
    const sortedThisWeek = filteredThisWeek.sort(sortByDay)
    const sortedPending = filteredPending.sort(sortByDay)
    const sortedNextWeek = filteredNextWeek.sort(sortByDay)

    return [sortedThisWeek, sortedNextWeek, sortedPending]
  }

  const setAssgiments = (subjects: Subject[]) => {
    const assigments: any = subjects.map((subject: Subject) => {
      const subjectName: string = subject.name
      const assigments = subject.assignments!
      const addedSubjectName = assigments.map((assigment) => {
        return {
          subjectName: subjectName,
          color: subject.color.color,
          ...assigment
        }
      })

      return addedSubjectName
    })
    const merged: Assignment[] = [].concat.apply([], assigments)
    const [onlyThisWeek, nextWeek, late] = groupByWeek(merged)

    setWeekAssigments(onlyThisWeek)
    setPendingAssigments(late)
    setNextWeekAssigments(nextWeek)
  }

  return [subjects, weekAssigments, nextWeekAssigments, pendingAssigments, setOnlySubjects, setAssgiments]
}

// Join subjects and assigments

const groupBy = (array: any[], key: any) => {
  return array.reduce((collection, item) => {
    (collection[item[key]] = collection[item[key]] || []).push(item)
    
    return collection
  }, {})
}

export const joinSubjectAssignment = (subjects: Subject[], assigments: Assignment[]) => {
  const groupAssigments = groupBy(assigments, 'subject')

  // If subjects exist but none has assignments
  if (subjects.length > 0 && assigments.length == 0) {
    const array = subjects.map((subject) => {
      subject.assignments = []
      return subject
    })

    return array
  }

  const array = subjects.map((subject) => {
    const subjectId = subject.id
    const assignmentIndex = assigments.findIndex((assignment) => assignment.subject == subjectId)

    if (assignmentIndex != -1) {
      const subjectAssigments = groupAssigments[subjectId]
      const newSubject: Subject = {
        ...subject,
        assignments: subjectAssigments
      }

      return newSubject
    } else {
      const newSubject: Subject = {
        ...subject,
        assignments: []
      }
      
      return newSubject
    }
  })
  
  return array
}

export const addColorToAssignment = (assignments: Assignment[], subject: Subject) => assignments.map((assignment) => {
  return {
    ...assignment,
    color: subject.color.color
  }
})