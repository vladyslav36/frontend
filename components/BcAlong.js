import React, { useEffect, useState } from 'react'
import styles from "@/styles/BcOptions.module.scss"
import "react-toastify/dist/ReactToastify.css"
import { toast, ToastContainer } from "react-toastify"
import { GiCheckMark } from 'react-icons/gi'
import { FaSave } from 'react-icons/fa'

export default function BcAlong({values,setValues}) {
  const [hasBarcods, setHasBarcods] = useState(false)
  const [inputValue, setInputValue] = useState(values.barcode)

  // если values.barcods присутствует, то values.barcode очищается
  useEffect(() => {
    const rez = Object.keys(values.options).length
      ? Object.keys(values.options).some(
          (option) => Object.keys(values.options[option]).length
        )
      : false
    if (rez) setValues({ ...values, barcode: '' })
   
  },[values.options])
  // --------------------------------------------------------------
   const handleCheck = (e) => {
     const checked = e.target.checked
     setHasBarcods(checked)
  }
  
  const handleSave = () => {
     if (inputValue.length !== 13) {
       toast.error("Количество цифр должно быть равно 13")
    }
    setValues({ ...values, barcode: inputValue })
    setInputValue('')
  }
  const handleChange = (e) => {
     e.preventDefault()
     const value = e.target.value.replace(/[^0-9]/gi, "")

     setInputValue(value)
  }
 
  return (
    <div className={styles.container}>
      <ToastContainer />
      <div className={styles.check_wrapper}>
        <input
          type="checkbox"
          id="check_btn"
          onChange={(e) => handleCheck(e)}
          checked={hasBarcods}
        />
        <label htmlFor="check_btn">Штрихкод</label>
        <GiCheckMark className={styles.icon} />
      </div>

      <div className={styles.flex_list}>
       
        {hasBarcods ? (
          <>
            <input
              type="text"
              onChange={handleChange}
              value={inputValue}
              maxLength="13"
            />

            <FaSave name="save" className={styles.icon} onClick={handleSave} />
          </>
        ) : (
          null
        )}
      </div>
    </div>
  )
}
