import React, { useMemo, useState } from 'react'
import styles from './styles.module.css'
import { useForm } from 'react-hook-form'
import { useAddDispatch, useAppSelector } from '../../app/hooks'
import { setMines, setData, setOpen, setSelected, setX, setY } from './redux/data'
import setting from './images/WMF-Agora-Settings_424242.svg.png'
import selectImg from './images/select.png'
import mine from './images/mine.png'
import notMine from './images/notMine.png'
import smileD from './images/smileD.png'
import smile from './images/smile.png'
import smileW from './images/smileWin.png'
import { Indicator } from './indicator/Indicator'
import { Counter } from './Counter'

export const MineArea: React.FC<any> = () => {
  const dispatch = useAddDispatch()
  const [formKey, setFormKey] = useState(true)
  const fragments = useAppSelector(state => state.data.field)
  const count = useAppSelector(state => state.data.selected)
  const mines = useAppSelector(state => state.data.mines)
  const status = useAppSelector(state => state.data.endGame)
  let key = 1
  const tdOnContMen: any = (e: any) => {
    e.preventDefault()
  }
  const mouseTdEvents = (e: React.MouseEvent<HTMLTableCellElement>) => {
    const x = e.currentTarget.getAttribute('x')
    const y = e.currentTarget.getAttribute('y')
    switch (e.buttons) {
      case 1: {
        if (status.end === 'defeat' && x === status.x && y === status.y) {
          e.currentTarget.className = styles.bomb
        }
        dispatch(setOpen({ x, y }))
        break
      }
      case 2: {
        dispatch(setSelected({ x, y }))
      }
    }
  }
  const setForm = () => {
    formKey ? setFormKey(false) : setFormKey(true)
  }
  type tdElemType = {
    opened: boolean,
    isBomb: boolean,
    x: number, y: number,
    text: string,
    select: boolean
  }
  const tdTextColor = (element: tdElemType) => {
    switch (element.text.toString()) {
      case '1':
        return { color: '#00f' }
      case '2':
        return { color: '#008000' }
      case '3':
        return { color: '#f00' }
      case '4':
        return { color: '#000080' }
      case '5':
        return { color: '#800000' }
      case '6':
        return { color: '#008080' }
      case '7':
        return { color: '#000' }
      case '8':
        return { color: '#808080' }
    }
  }
  const tdContent = (element: tdElemType) => {
    if (element.select &&
      status.end === 'defeat' &&
      !element.isBomb) {
      // eslint-disable-next-line react/jsx-filename-extension
      return <img src={notMine} alt={''}/>
    } else if (element.opened && element.isBomb) {
      return <img src={mine} alt={''}/>
    } else if (element.opened && !element.isBomb) {
      return <span style={tdTextColor(element)}>{element.text}</span>
    } else if (!element.opened && element.select) {
      return <img src={selectImg} alt={''}/>
    }
  }
  const newGame = () => {
    dispatch(setData())
  }
  const SmileButtonComponent: React.FC<any> = () => {
    if (status.end === 'victory' || (count === mines && status.end === 'victory')) {
      return <button onMouseUp={newGame} className={styles.smile}>
        <img src={smileW} alt={''}/>
      </button>
    } else if (status.end === 'defeat') {
      return <button onMouseUp={newGame} className={styles.smile}>
        <img src={smileD} alt={''}/>
      </button>
    } else if (status.end === '') {
      return <button onMouseUp={newGame} className={styles.smile}>
        <img src={smile} alt={''}/>
      </button>
    }
    return null
  }
  const [reset, setReset] = useState(false)
  const [run, setRun] = useState(true)
  useMemo(() => {
    if (status.end !== '') {
      setRun(false)
    } else setRun(true)
  }, [status.end])
  const timeReset = () => {
    setReset(true)
    setTimeout(() => setReset(false), 1000)
  }
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  return <div id={styles.area}>
    {formKey && <div id={styles.modalWindow}><Form formKey={setForm} timeReset={timeReset}/></div>}
    <button onMouseUp={setForm}><img src={setting} alt={''}/></button>
    <div id={styles.panel}>
      {
        reset ? <Indicator data={'0'}/> : <Counter reset={reset} run={run}/>
      } <span onMouseUp={timeReset}><SmileButtonComponent/></span>
      <Indicator data={count + '/' + mines}/>
    </div>
    <table>
      <tbody>
      {
        fragments.map((elemTr) => {
          return <tr key={key++}>
            {elemTr.map((elemTd: typeof elemTr[0]) => {
              const props = { x: elemTd.x, y: elemTd.y }
              if (status.end === 'defeat' && elemTd.y === status.y && elemTd.x === status.x) console.log(111)
              return <td {...props} onContextMenu={tdOnContMen}
                         onMouseDown={mouseTdEvents}
                         key={key++} className={
                (status.end === 'defeat' &&
                  elemTd.y.toString() === status.y &&
                  elemTd.x.toString() === status.x)
                  ? styles.bomb
                  : (elemTd.opened === true && elemTd.isBomb === false)
                      ? styles.open
                      : (elemTd.opened === true && elemTd.isBomb === true) ? styles.isBomb : styles.close
              }>
                {tdContent(elemTd)}
              </td>
            })}
          </tr>
        })
      }
      </tbody>
    </table>
  </div>
}

const Form: React.FC<any> = (props) => {
  const dispatch = useAddDispatch()
  const x = useAppSelector(state => state.data.x)
  const y = useAppSelector(state => state.data.y)
  const { register, handleSubmit, formState: { errors } } = useForm()
  const onSubmit = () => {
    dispatch(setData())
    props.timeReset()
    props.formKey()
  }
  // console.log(watch('example')) // watch input value by passing the name of it
  const inputX = (e: any) => {
    dispatch(setX(+e.target.value))
  }
  const inputY = (e: any) => {
    dispatch(setY(+e.target.value))
  }
  const inputBombs = (e: any) => {
    dispatch(setMines(+e.target.value))
  }
  return <form onSubmit={handleSubmit(onSubmit)}>

    <span>X</span>
    <input value={x} onInput={inputX}
           {...register('X', { required: true })}
           autoComplete={'off'}
    />

    <span>Y</span>
    <input value={y} onInput={inputY}
           {...register('Y', { required: true })}
           autoComplete={'off'}
    />
    <div/>
    <span>number of mines</span>
    <input placeholder={'max: ' + x * y} onInput={inputBombs}
           {...register('bombs', { required: true })}
           autoComplete={'off'}
    />
    {errors.exampleRequired && <span>This field is required</span>}

    <input value={'OK'} type="submit"/>
  </form>
}
