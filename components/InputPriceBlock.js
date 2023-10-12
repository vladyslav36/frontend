import React, { useState } from "react"
import styles from "@/styles/InputPriceBlock.module.scss"
import { FaShareAlt } from "react-icons/fa"
import { stringToPrice } from "utils"

export default function InputPriceBlock({ values, setValues, arr }) {
  const getValue = () => {
    let priceObj = JSON.parse(JSON.stringify(values.optionValues))
    arr.forEach((item) => {
      priceObj = priceObj[item]
    })

    return priceObj
  }

  const setValueToPrice = ({ value, name, optionValues }) => {
    let obj = JSON.parse(JSON.stringify(optionValues))
    let rez = obj
    if (arr.length === 0) {
      rez[name] = value
    } else {
      for (let i = 0; i < arr.length - 1; i++) {
        rez = rez[arr[i]]
      }
      rez[arr[arr.length - 1]][name] = value
    }
    return obj
  }
  const handleBlur = (e) => {
    let { value, name } = e.target
    value = stringToPrice(value)
    const obj = setValueToPrice({
      value,
      name,
      optionValues: values.optionValues,
    })

    setValues({ ...values, optionValues: obj })
  }
  const changeHandler = (e) => {
    let { value, name } = e.target
    value =
      name === "price"
        ? value.replace(/[^\d.,]+/g, "").replace(",", ".")
        : value.replace(/[^\d]+/g, "")

    let optionValues = JSON.parse(JSON.stringify(values.optionValues))
    let priceObj = optionValues
    arr.forEach((item) => {
      priceObj = priceObj[item]
    })
    priceObj[name] = value

    setValues({ ...values, optionValues })
  }

  const shareHandler = (arr) => {
    let priceObj = values.optionValues
    arr.forEach((item) => {
      priceObj = priceObj[item]
    })
    const { price } = priceObj
    const optionValues = JSON.parse(JSON.stringify(values.optionValues))
    const deep = (optionValues) => {
      if (optionValues.hasOwnProperty("price")) {
        optionValues.price = price
        return
      } else {
        Object.keys(optionValues).forEach((item) => {
          deep(optionValues[item])
        })
      }
    }
    deep(optionValues)
    setValues({ ...values, optionValues })
  }

  return (
    <div className={styles.price_block}>
      <div title="Скопировать на все поля" onClick={() => shareHandler(arr)}>
        {arr.length ? <FaShareAlt className={styles.icon} /> : null}
      </div>

      <input
        type="text"
        id="price"
        name="price"
        placeholder="Цена"
        value={getValue().price || ""}
        onChange={changeHandler}
        onBlur={handleBlur}
      />
      <input
        type="text"
        id="barcode"
        name="barcode"
        maxLength={13}
        placeholder="Штрихкод"
        value={getValue().barcode || ""}
        onChange={changeHandler}
      />
    </div>
  )
}
