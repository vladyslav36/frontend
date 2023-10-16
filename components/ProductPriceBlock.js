import React, { useEffect, useState } from "react"
import { getCurrencySymbol } from "utils"
import styles from "@/styles/ProductPriceBlock.module.scss"
import { FaChevronDown, FaChevronUp } from "react-icons/fa"

export default function ProductPriceBlock({ product, arr, setValues, values }) {
  const getValue = () => {
    let qntObj = values
    let error=false
    arr.forEach(item => {
      if (item in qntObj) {
         qntObj = qntObj[item]  
      } else {
        error=true
      }
    })
    if (error) return ''     
    return qntObj.qnt
  }

  const setValue = (value) => {
     const copyValues = JSON.parse(JSON.stringify(values))
     let qntObj = copyValues
     // error выставляется если arr уже соответствуют новому продукту а values еще старому
     let error = false
     arr.forEach((item) => {
      //  if (item in qntObj) {
         qntObj = qntObj[item]
      //  } else {
      //    error = true
      //  }
     })

    //  if (error) return
     qntObj.qnt = value
     setValues(copyValues)
  }
  

  let priceObj = product.optionValues
  arr.forEach((item) => {
    priceObj = priceObj[item]
  })
  const price = priceObj.price + " " + getCurrencySymbol(product.currencyValue)

 

  const handleChange = (e) => {
    let { value } = e.target
    value = value.replace(/[^\d]+/g, "")
    e.preventDefault()
   setValue(value)
    
  }
  const increment = () => {
    let value=getValue()
   value = +value.replace(/[^\d]+/g, "")
    value = value >= 999 ? value.toString() : (value + 1).toString()
  setValue(value)
    
  }
  const decrement = (e) => {
    let value = getValue()
     value = +value.replace(/[^\d]+/g, "")
    value = value <= 1 ? "" : (value - 1).toString()
  setValue(value)
   
  }
  const handleBlur = (e) => {
    let value = e.target.value
    value = (+value).toString()
  setValue(value)
   
  }
console.log(values)
  return (
    <div className={styles.flex_block}>
      <div>
        <FaChevronDown onClick={decrement} />
        <input
          type="text"
          value={getValue()}
          onChange={handleChange}
          maxLength={3}
          onBlur={handleBlur}
        />

        <FaChevronUp onClick={increment} />
      </div>
      <div>{price}</div>
    </div>
  )
}
