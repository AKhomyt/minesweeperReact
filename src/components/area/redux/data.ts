import { createSlice, current } from '@reduxjs/toolkit'
import { copyObject, setArray, setFragmentsAround } from '../custom'

const sliceData = createSlice({
  name: 'data',
  initialState: {
    x: 5,
    y: 5,
    mines: 15,
    selected: 0,
    opened: 0,
    field: setArray(5, 5, 7),
    endGame: { x: '0', y: '0', end: '' }
  },
  reducers: {
    setData (state) {
      // action - {x, y, mines}
      state.field = setArray(current(state).x, current(state).y, current(state).mines)
      state.endGame.end = ''
      state.selected = 0
      state.opened = 0
    },
    setX (state, action) {
      state.x = action.payload
    },
    setY (state, action) {
      state.y = action.payload
    },
    setMines (state, action) {
      state.mines = action.payload
    },
    setSelected (state, action) {
      // action - {x, y}
      if (current(state).opened === current(state).x * current(state).y &&
        current(state).selected === current(state).mines) {
        return state
      }
      const x = action.payload.x
      const y = action.payload.y
      if (current(state).endGame.end ||
        current(state).field[y][x].opened) {
        return state
      }
      if (current(state.field)[y][x].select === false) {
        state.field[y][x].select = true
        state.opened = ++current(state).opened
        state.selected = ++current(state).selected
        if (current(state).opened === current(state).x * current(state).y &&
          current(state).selected === current(state).mines) {
          state.endGame.end = 'victory'
        }
      } else {
        state.field[y][x].select = false
        state.opened = --current(state).opened
        state.selected = --current(state).selected
      }
    },
    setOpen (state, action) {
      // action - {x, y}
      const tempArray = copyObject(current(state).field)
      const x: number = +action.payload.x
      const y: number = +action.payload.y
      if (tempArray[y][x].select === true ||
        tempArray[y][x].opened === true ||
        current(state).endGame.end.length !== 0
      ) {
        return state
      }
      // Bomb is
      if (tempArray[y][x].isBomb === true &&
        tempArray[y][x].select === false) {
        state.endGame.y = y.toString()
        state.endGame.x = x.toString()
        state.endGame.end = 'defeat'
        let openedTemp = 0
        for (let y = 0; y < current(state).y; y++) {
          for (let x = 0; x < current(state).x; x++) {
            if (tempArray[y][x].opened === false && tempArray[y][x].select === false) {
              tempArray[y][x].opened = true
              openedTemp = ++current(state).opened
            } else tempArray[y][x].opened = true
          }
        }
        state.opened = openedTemp
        state.field = tempArray
      } else {
        state.opened += setFragmentsAround(x, y, tempArray)
        if (current(state).opened === current(state).x * current(state).y &&
          current(state).selected === current(state).mines) {
          if (current(state).mines === current(state).selected) {
            state.endGame.end = 'victory'
          }
        }
        state.field = tempArray
      }
    }
  }
})

export default sliceData
export const { setData, setOpen, setX, setY, setMines, setSelected } = sliceData.actions
