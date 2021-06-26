import React, { createContext, useContext, useEffect, useState } from 'react'
import { FC } from 'react'
import { Subject } from '../interface/interfaces'
import auth from '@react-native-firebase/auth'
import { getAssigments, getSubjects } from '../lib/firestore'
import { joinSubjectAssignment } from '../hooks/useSubjects'
import { existAssignmentNotification } from '../lib/notifications'
import { useTranslation } from 'react-i18next'

const SubjectContext = createContext({})

export const SubjectProvider: FC = ({ children }) => {
  const { t } = useTranslation()
  const user = auth().currentUser
  const [render, setRender] = useState(0)
  const [loading, setLoading] = useState(true)
  const [subjects, setSubjects] = useState<Subject[]>([])

  const getHandler = async() => {
    const subjects: Subject[] = await getSubjects(user)
    const assigments: any[] = await getAssigments(user, subjects)
    existAssignmentNotification(assigments, subjects, t)

    const join: Subject[] = joinSubjectAssignment(subjects, assigments)
    setSubjects(join)
    setLoading(false)
  }

  useEffect(() => {
    if (user == null) {
      setLoading(false)
      return
    } else {
      getHandler()
    }
  }, [user, render])

  const refreshSubjects = async() => await getHandler()

  return (
    <SubjectContext.Provider value={{ subjects, setSubjects, loading, render, setRender, refreshSubjects }}>
      {children}
    </SubjectContext.Provider>
  )
}

export const useSubjectProvider = () => useContext(SubjectContext)