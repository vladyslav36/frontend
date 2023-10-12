import React, { useEffect, useState } from "react"
import { getCurrencySymbol, getStringPrice } from "utils"
import styles from "@/styles/ProductPriceBlock.module.scss"
import { FaCaretSquareUp, FaChevronDown, FaChevronUp } from "react-icons/fa"

export default function ProductPriceBlock({ product, arr, setValues, values }) {
  const [inputValue, setInputValue] = useState("")
  let priceObj = product.optionValues
  arr.forEach((item) => {
    priceObj = priceObj[item]
  })
  const price = priceObj.price + " " + getCurrencySymbol(product.currencyValue)

  // useEffect(() => {
  //   const fillingOwnOptions = Object.keys(product.ownOptions).filter(
  //     (item) => product.ownOptions[item].length
  //   )
  //   const options = {}
  //   arr.forEach((item, i) => {
  //     options[fillingOwnOptions[i]] = item
  //   })
   
  //   setValues([
  //     ...values,
  //     {
  //       name: product.name,
  //       options,
  //       qnt: inputValue,
  //       price: priceObj.price,
  //       currencyValue: product.currencyValue,
  //     },
  //   ])
  //   console.log(options)
  // }, [inputValue])

  useEffect(() => {
     const copyValues=JSON.parse(JSON.stringify(values)) 
     let qntObj =copyValues
     arr.forEach((item) => {
       qntObj = qntObj[item]
     })
    qntObj.qnt = inputValue
    setValues(copyValues)
  },[inputValue])

  

  const handleChange = (e) => {
    let { value } = e.target
    value = value.replace(/[^\d]+/g, "")
    e.preventDefault()
    setInputValue(value)
  }
  const increment = () => {
    let value = +inputValue.replace(/[^\d]+/g, "")
    value = value >= 999 ? value.toString() : (value + 1).toString()

   
    setInputValue(value)
  }
  const decrement = (e) => {
    let value = +inputValue.replace(/[^\d]+/g, "")
    value = value <= 1 ? "" : (value - 1).toString()
    setInputValue(value)
  }
  const handleBlur = (e) => {
    let value = e.target.value
    value = (+value).toString()
    setInputValue(value)
  }

  return (
    <div className={styles.flex_block}>
      <div>
        <FaChevronDown onClick={decrement} />
        <input
          type="text"
          value={inputValue}
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
