import React, { useEffect, useState } from "react"
import styles from "@/styles/BcOptions.module.scss"
import { optionsToBarcods } from "utils"
import { GiCheckMark } from "react-icons/gi"

export default function BcOptions({ values, setValues }) {
  const [hasBarcods, setHasBarcods] = useState(false)
  useEffect(() => {
    const barcods = optionsToBarcods(values.options)
    setValues({...values,barcods})
  }, [values.options])

  const handleCheck = (e) => {
    const checked = e.target.checked
    setHasBarcods(checked)
  }
console.log(values.barcods)
  return (
    <div className={styles.container}>
      <div className={styles.check_wrapper}>
        <input
          type="checkbox"
          id="check_button"
          onChange={(e) => handleCheck(e)}
          checked={hasBarcods}
        />
        <label for="check_button">Штрихкод</label>
        <GiCheckMark className={styles.icon} />
      </div>
      {hasBarcods && Object.keys(values.barcods).length ? (
        <div className={styles.flex_list}>
          {Object.keys(values.barcods).map(option => (
            <div className={styles.flex_item}>{option}</div>
          ))}
        </div>
      ) : null}
     
      </div>
   
  )
}
