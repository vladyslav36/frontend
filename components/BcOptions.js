import React, { useEffect, useRef, useState } from "react"
import styles from "@/styles/BcOptions.module.scss"
import { copyBarcods, optionsToBarcods } from "utils"
import { GiCheckMark } from "react-icons/gi"
import { FaArrowAltCircleLeft, FaLongArrowAltRight, FaSave } from "react-icons/fa"
import "react-toastify/dist/ReactToastify.css"
import { toast,ToastContainer } from "react-toastify"

export default function BcOptions({ values, setValues }) {
  const [hasBarcods, setHasBarcods] = useState(false)
  const [crumbsArr, setCrumbsArr] = useState([])
  const [currentBarcods, setCurrentBarcods] = useState({ ...values.barcods })
  const [showInput, setShowInput] = useState(false)
  const [inputValue, setInputValue] = useState('')
  

  useEffect(() => {    
    const barcods = optionsToBarcods(values.options)
    copyBarcods(values.barcods,barcods)
    setValues({ ...values, barcods })
    setCurrentBarcods({ ...barcods })
    setCrumbsArr([])
  }, [values.options])

  useEffect(() => {
    const barcode = crumbsArr.length
      ? crumbsArr.reduce((acc, item) => acc[item], { ...values.barcods })
      : { ...values.barcods }
    if (typeof(barcode)==='string') setInputValue(barcode)
    setCurrentBarcods(barcode)
    setShowInput(typeof barcode === "object" ? false : true)
    
  }, [crumbsArr])
  
  const handleCheck = (e) => {
    const checked = e.target.checked
    setHasBarcods(checked)
   
  }

  const handleClick = (option) => {
    setCrumbsArr([...crumbsArr, option])
  }

  const handleBack = () => {
    setCrumbsArr(crumbsArr.slice(0, -1))
  }

  const handleSave = () => {
    if (inputValue.length !== 13) {
      toast.error('Количество цифр должно быть равно 13')
    }
    const barcods = { ...values.barcods }
    let lastObj = crumbsArr.slice(0, -1).reduce((acc, item) => acc[item], barcods)  
    const lastKey = crumbsArr[crumbsArr.length - 1]    
    lastObj[lastKey] = inputValue
    setValues({ ...values, barcods })
    setInputValue('')
  }
  const handleChange=(e) => {
    e.preventDefault()
    const value = e.target.value.replace(/[^0-9]/gi, '')
    
    setInputValue(value)
  }
  
  
  return (
    <div className={styles.container}>
      <ToastContainer />
      <div className={styles.check_wrapper}>
        <input
          type="checkbox"
          id="check_button"
          onChange={(e) => handleCheck(e)}
          checked={hasBarcods}
        />
        <label htmlFor="check_button">Штрихкод</label>
        <GiCheckMark className={styles.icon} />

        <div className={styles.crumbs}>
          {crumbsArr.map((item, i) => (
            <div key={i}>
              <div>{item}</div>
              {(i >= 0 && i < crumbsArr.length - 1) ? <>&nbsp; <FaLongArrowAltRight />&nbsp; </>: null}
             
              
            </div>
          
          ))}
        </div>
      </div>
      {hasBarcods &&
      (Object.keys(currentBarcods).length ||
        typeof currentBarcods === "string") ? (
        <div className={styles.flex_list}>
          <FaArrowAltCircleLeft
            name="back"
            className={styles.icon}
            onClick={handleBack}
          />
          {showInput ? (
            <>
              <input
                type="text"
                onChange={handleChange}
                value={inputValue}
                maxLength="13"
              />

              <FaSave
                name="save"
                className={styles.icon}
                onClick={handleSave}
              />
            </>
          ) : (
            Object.keys(currentBarcods)
              .sort()
              .map((option, i) => (
                <div
                  key={i}
                  className={styles.flex_item}
                  onClick={() => handleClick(option)}
                >
                  {option}
                </div>
              ))
          )}
        </div>
      ) : null}
    </div>
  )
}
