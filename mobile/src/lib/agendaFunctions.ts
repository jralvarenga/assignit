import { Assignment, Subject } from "../interface/interfaces"

const translateMonthNames = (t: any): string[] => [t('January'),t('February'),t('March'),t('April'),t('May'),t('June'),t('Jule'),t('August'),t('September'),t('October'),t('November'),t('December')]
const translateDayNames = (t: any): string[] => [t('Sunday'),t('Monday'),t('Thuesday'),t('Wednesday'),t('Thurdsday'),t('Friday'),t('Saturdar')]

const groupBy = (array: any[], key: any) => {
  return array.reduce((collection, item) => {
    (collection[item[key]] = collection[item[key]] || []).push(item)
    
    return collection
  }, {})
}

const compare = ( a: any, b: any ) => {
  if ( a.numberDate < b.numberDate ){
    return -1;
  }
  if ( a.numberDate > b.numberDate ){
    return 1;
  }
  return 0;
}

export const getDates = (month: number, currentDate: Date) => {
  const firstDate = new Date(currentDate.getFullYear(), month, 1)
  const lastDate = new Date(currentDate.getFullYear(), month + 1, 0)
  const first = firstDate.getDate()
  const last = lastDate.getDate()
  let dates = []

  for (let n = first; n <= last; n++) {
    dates.push(n)
  }

  return dates
}

export const getDayString = (datetime: Date, translator: Function) => {
  const day = translateDayNames(translator)[ datetime.getDay() ]
  const date = datetime.getDate()
  const month = translateMonthNames(translator)[datetime.getMonth()]
  const year = datetime.getFullYear()

  return `${day} ${date}, ${month} ${year}`
}

const filterAssignmentsAgenda = (assignments: Assignment[]) => {
  const dates = assignments.map((assignment) => {
    const day = assignment.from.getDate() < 10 ? `0${assignment.from.getDate()}` : `${assignment.from.getDate()}`
    const month = (assignment.from.getMonth() + 1) < 10 ? `0${(assignment.from.getMonth() + 1)}` : `${(assignment.from.getMonth() + 1)}`
    const year = `${(assignment.from.getFullYear())}`
    const date = `${year}-${month}-${day}`

    return { date: date, ...assignment}
  })
  const groupByDate: object = groupBy(dates, 'date')

  return groupByDate
}

export const groupAssigmentsHour = (assignments: Assignment[], subjects: Subject[]) => {
  const hours = assignments.map((assignment) => {
    const datetime = assignment.from
    const hour: number = datetime.getHours() > 12 ? datetime.getHours() - 12 : datetime.getHours()
    const minute: any = datetime.getMinutes() < 10 ? `0${datetime.getMinutes()}` : datetime.getMinutes()
    const timeZone: string = datetime.getHours() > 12 ? 'pm' : 'am'
    const stringTime: string = `${hour}:${minute} ${timeZone}`

    
    const index = subjects.map((subject: Subject) => subject.id ).indexOf(assignment.subject);

    return { hour: stringTime, subjectName: subjects[index].name, color: subjects[index].color.color, ...assignment}
  })
  const groupByHour: object = groupBy(hours, 'hour')

  return groupByHour
}


const getSelectedAssigments = (obj: any, id: string) => {
  for (const key in obj) {
    if (id == key) {
      return obj[key]
    }
  }
}

const groupAssigments = (subjects: Subject[]) => {
  let groupedAssigments: any[] = []
  subjects!.map((subject: Subject) => {
    const color = subject.color.color
    subject.assignments!.map((assigment: Assignment) => {
      groupedAssigments.push({ ...assigment, color: color })
    })
  })
  return groupedAssigments
}

export const groupAssigmentsAgenda = (subjects: Subject[], toDate: Date) => {
  const day = toDate.getDate() < 10 ? `0${toDate.getDate()}` : `${toDate.getDate()}`
  const month = toDate.getMonth() + 1 < 10 ? `0${toDate.getMonth() + 1}` : `${(toDate.getMonth() + 1)}`
  const dateKey = `${toDate.getFullYear()}-${month}-${day}`

  const groupedAssigments: Assignment[] = groupAssigments(subjects)
  const filtered = filterAssignmentsAgenda(groupedAssigments)
  const selectedAssigments = getSelectedAssigments(filtered, dateKey)
  
  if (selectedAssigments != undefined) {
    const groupByHour = groupAssigmentsHour(selectedAssigments, subjects!)
    return groupByHour
  } else {
    return undefined
  }
  
}

export const markedAssigments = (subjects: Subject[]) => {
  const groupedAssgiments: Assignment[] = groupAssigments(subjects)
  const dates = groupedAssgiments.map((assignment) => {
    const day = assignment.from.getDate()
    const month = assignment.from.getMonth()
    const year = assignment.from.getFullYear()
    const date = `${year}-${month}-${day}`

    return { date: date, ...assignment}
  })

  const groupByDate: object = groupBy(dates, 'date')

  return groupByDate
}