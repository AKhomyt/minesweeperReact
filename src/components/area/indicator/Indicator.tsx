import React from 'react'
import styles from './indicator.module.css'
export const Indicator: React.FC<any> = ({ data, ...props }) => {
  return <div className={styles.indicator}>
    { data }
  </div>
}
