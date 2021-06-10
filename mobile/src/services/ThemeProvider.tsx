import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useColorScheme } from 'react-native'
import { Settings } from '../interface/interfaces'

const ThemeContext = createContext({})

export const ThemeProvider = ({ children }: any) => {
  const scheme = useColorScheme()
  const [colorScheme, setColorScheme] = useState<string>(scheme!)

  const getSelectedColorScheme = async() => {
    const stringSettings: string | null = await AsyncStorage.getItem('settings')
    const settings: Settings = JSON.parse(stringSettings!)
    if (settings.colorScheme != undefined) {
      setColorScheme(settings.colorScheme)
    } else {
      setColorScheme(scheme!)
    }
  }
  
  useEffect(() => {
    getSelectedColorScheme()
  }, [scheme])

  return (
    <ThemeContext.Provider value={{ colorScheme, setColorScheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useUserColorScheme = () => useContext(ThemeContext)