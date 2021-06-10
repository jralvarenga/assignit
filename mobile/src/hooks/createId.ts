export const createSubjectId = (subject: string) => {
  let extra = ""
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567890123456789"
  for ( let i = 0; i < 5; i++ ) {
    extra += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  const id = `${subject}-${extra}`
  return id
}

export const createDummyAssignmentId = () => {
  let id = ""
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567890123456789"
  for ( let i = 0; i < 15; i++ ) {
    id += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  return id
}

export const createNotiId = () => {
  let intString = ""
  const numbers = '123456789123456789123456789123456789123456789123456789'
  for ( let i = 0; i < 8; i++ ) {
    intString += numbers.charAt(Math.floor(Math.random() * numbers.length))
  }
  const signs = ['', '-']

  const selectedSign = signs[Math.floor(Math.random() * signs.length)]
  const withSign = `${selectedSign}${intString}`

  return +withSign
}