export const setArray = (x: number, y: number, bombs: number): Array<any> => {
  const result: Array<Array<any>> = []
  for (let i = 0; i < y; i++) {
    result[i] = []
    for (let j = 0; j < x; j++) {
      result[i][j] = { opened: false, isBomb: false, x: j, y: i, text: '', select: false }
    }
  }
  const tempArray: any = []
  for (let Y = 0; Y < y; Y++) {
    tempArray[Y] = []
    for (let X = 0; X < x; X++) {
      tempArray[Y][X] = X
    }
  }
  for (let i = 0; i < bombs; i++) {
    if (y * x < bombs) break
    const randomY = Math.round(Math.random() * (y - 1))
    if (tempArray[randomY].length === 0) {
      i--
      continue
    }
    const randomX = Math.round(Math.random() * (tempArray[randomY].length - 1))
    result[randomY][tempArray[randomY][randomX]].isBomb = true
    tempArray[randomY].splice(randomX, 1)
  }
  return result
}
export const copyObject = (obj: any) => {
  let result: any
  if (Array.isArray(obj)) {
    result = []
    for (const i of obj) {
      if (typeof i === 'object') {
        result.push(copyObject(i))
      } else result.push(i)
    }
  } else if (typeof obj === 'object') {
    result = {}
    for (const i in obj) {
      if (typeof obj[i] === 'object') {
        result[i] = copyObject(obj[i])
      } else result[i] = obj[i]
    }
  } else result = obj
  return result
}

type arrFragmentType = [[{
  opened: boolean,
  isBomb: boolean,
  x: number,
  y: number,
  text: string | number,
  select: boolean
}]]
export const setFragmentsAround = (x: number, y: number, array: arrFragmentType) => {
  let opened = 0
  const fieldsAround = [
    {
      x: (x - 1),
      y
    },
    {
      x: (x - 1),
      y: (y - 1)
    },
    {
      x,
      y: (y - 1)
    },
    {
      x: (x + 1),
      y: (y - 1)
    },
    {
      x: (x + 1),
      y
    },
    {
      x: (x + 1),
      y: (y + 1)
    },
    {
      x,
      y: (y + 1)
    },
    {
      x: (x - 1),
      y: (y + 1)
    }
  ]
  let countBombs = 0
  for (const i of fieldsAround) {
    if (i.x < 0 || i.y < 0 || i.x > array[0].length - 1 || i.y > array.length - 1) continue
    if (array[i.y][i.x].isBomb) countBombs++
  }
  array[y][x].text = (countBombs !== 0) ? countBombs : ''
  opened++
  array[y][x].opened = true
  if (countBombs === 0) {
    for (const i of fieldsAround) {
      if (i.x < 0 || i.y < 0 || i.x > array[0].length - 1 || i.y > array.length - 1) continue
      if (array[i.y][i.x].opened) continue
      opened += setFragmentsAround(i.x, i.y, array)
    }
  }
  return opened
}
