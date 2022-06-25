import React, { useMemo, useState } from 'react'
import { Indicator } from './indicator/Indicator'

let temp: any
export const Counter: React.FC<any> = ({ run, reset, fixRes, ...props }) => {
  const [count, setCount] = useState(1)
  const timeout = setTimeout(() => {
    if (run === false) return
    setCount(count + 1)
  }, 1000)
  useMemo(() => {
    setCount(0)
    temp = 0
    run = 0
  }, [reset])
  useMemo(() => {
    clearTimeout(timeout)
    temp = count
  }, [run])
  return <Indicator data={run ? count : temp}/>
}
