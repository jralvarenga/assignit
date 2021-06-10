import { useState } from 'react'
import { Assignment, Subject } from '../interface/interfaces'

const groupBy = (array: any[], key: any) => {
  return array.reduce((collection, item) => {
    (collection[item[key]] = collection[item[key]] || []).push(item)
    
    return collection
  }, {})
}

const compare = ( a: any, b: any ) => {
  if ( a.from < b.from ){
    return -1;
  }
  if ( a.from > b.from ){
    return 1;
  }
  return 0;
}

const translateDayNames = (t: any): string[] => [t('Su.'),t('Mon.'),t('Thue.'),t('Wed.'),t('Thur.'),t('Fri.'),t('Sat.')]
const translateMonthNames = (t: Function): string[] => [t('Jan.'),t('Feb.'),t('Mar.'),t('Apr.'),t('May.'),t('Jun.'),t('Jul.'),t('Aug.'),t('Sep.'),t('Oct.'),t('Nov.'),t('Dec.')]

export const useDatetime = (type: string, translator: Function) => {
  const [date, setDate] = useState<any>({
    date: new Date(),
    string: translator('Select date')
  })
  const [time, setTime] = useState<any>({
    time: new Date(),
    string: translator('Select time')
  })

  const reset = () => {
    setDate({
      date: new Date(),
      string: translator('Select date')
    })
    setTime({
      time: new Date(),
      string: translator('Select time')
    })
  }

  const setSelectedDate = (datetime: string, translator: Function) => {
    const selectedDate = new Date(datetime)    
    const date: number = selectedDate.getDate()
    const day: number = selectedDate.getDay()
    const month: number = selectedDate.getMonth()
    const year: number = selectedDate.getFullYear()
    const stringDate: string = `${translateDayNames(translator)[day]} ${date}, ${translateMonthNames(translator)[month]} ${year}`
    
    const newDate = {
      date: selectedDate,
      string: stringDate
    }
    setDate(newDate)
  }

  const setSelectedTime = (datetime: string) => {
    const selectedTime = new Date(datetime)

    const hour: number = selectedTime.getHours() > 12 ? selectedTime.getHours() - 12 : selectedTime.getHours()
    const minute: any = selectedTime.getMinutes() < 10 ? `0${selectedTime.getMinutes()}` : selectedTime.getMinutes()
    const timeZone: string = selectedTime.getHours() > 12 ? 'pm' : 'am'
    const stringTime: string = `${hour}:${minute} ${timeZone}`
    const newTime = {
      time: selectedTime,
      string: stringTime
    }
    setTime(newTime)
  }

  switch (type) {
    case 'date':
      return [ date, setSelectedDate, reset ]
    case 'time':
      return [ time, setSelectedTime, reset ]
  
    default:
      return [ date, setSelectedDate, reset ]
  }
}

export const dateParams = (datetime: Date) => {

  return {
    date: datetime.getDate(),
    day: datetime.getDay(),
    month: datetime.getMonth(),
    year: datetime.getFullYear()
  }
}

export const timeParams = (datetime: Date) => {
  const currentDatetime = new Date()
  // Add timezone offset to picked hour
  const timezoneOffset: number = currentDatetime.getTimezoneOffset()
  
  return {
    hour:  datetime.getHours(),
    minutes: datetime.getMinutes() + timezoneOffset
  }
}

export const dateString = (datetime: Date, translator: Function) => {
  const date: number = datetime.getDate()
  const day: number = datetime.getDay()
  const month: number = datetime.getMonth()
  const year: number = datetime.getFullYear()
  const stringDate: string = `${translateDayNames(translator)[day]} ${date}, ${translateMonthNames(translator)[month]} ${year}`

  return stringDate
}

export const timeString = (datetime: Date) => {
  const hour: number = datetime.getHours() > 12 ? datetime.getHours() - 12 : datetime.getHours()
  const minute: any = datetime.getMinutes() < 10 ? `0${datetime.getMinutes()}` : datetime.getMinutes()
  const timeZone: string = datetime.getHours() > 12 ? 'pm' : 'am'
  const stringTime: string = `${hour}:${minute} ${timeZone}`
  
  return stringTime
}

export const filterAssignments = (assignments: Assignment[], translator: Function) => {
  const sortedByDates = assignments.sort( compare )
  const dates = sortedByDates.map((assignment) => {
    const date: string = dateString(assignment.from, translator)

    return { date: date, ...assignment}
  })
  const groupByDate: object = groupBy(dates, 'date')

  return groupByDate
}

export const getGreetingMessage = (translator: Function) => {
  const date = new Date()
  date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
  const hour = date.getHours()

  const message = hour < 12 ? translator('Good morning') : hour < 18 && hour > 12 ? translator('Good afternoon') : translator('Good evening')

  return message
}