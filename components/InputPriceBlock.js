import React, { useState } from 'react'
import styles from '@/styles/InputPriceBlock.module.scss'

export default function InputPriceBlock({ values,setValues, arr }) {
  const getValue = () => {
    let rez = JSON.parse(JSON.stringify(values.optionValues))
    arr.forEach((item) => {
      rez = rez[item]
    })
    
    return rez
  }
  const [inputValues, setInputValues] = useState(getValue())
  
   const changeHandler = (e) => {
     const { value, name } = e.target
     let obj = JSON.parse(JSON.stringify(values.optionValues))
     let rez = obj
     if (arr.length === 0) {
       rez[name] = value
     } else {
       for (let i = 0; i < arr.length - 1; i++) {
         rez = rez[arr[i]]
       }
       rez[arr[arr.length - 1]][name] = value
     }

     setValues({ ...values, optionValues: obj })
     setInputValues(obj)
  }
  
  return (
    <div className={styles.price_block}>
      <input
        type="text"
        id="price"
        name="price"
        placeholder="Цена"
        value={inputValues.price}
        onChange={ changeHandler}
      />
      <input
        type="text"
        id="barcode"
        name="barcode"
        placeholder="Штрихкод"
        value={ inputValues.barcode}
        onChange={changeHandler}
      />
    </div>
  )
}
