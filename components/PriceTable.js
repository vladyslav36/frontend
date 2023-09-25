import React, { useState } from "react"
import styles from "@/styles/PriceTable.module.scss"

export default function PriceTable({ values, setValues }) {
  const getValue = (arr) => {
    let rez = JSON.parse(JSON.stringify(values.optionValues))
    arr.forEach((item) => {
      rez = rez[item]
    })

    return rez
  }

  const changeHandler = (e, arr) => {
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
  }
  const table = []
  let level = 0
  const crumbs = []

  const priceBlock = (arr) => (
    <div className={styles.price_block}>
      <input
        type="text"
        id="price"
        name="price"
        placeholder="Цена"
        value={getValue(arr).price}
        onChange={(e) => changeHandler(e, arr)}
      />
      <input
        type="text"
        id="barcode"
        name="barcode"
        placeholder="Штрихкод"
        value={getValue(arr).barcode}
        onChange={(e) => changeHandler(e, arr)}
      />
    </div>
  )

  const maxLevel = Object.keys(values.ownOptions).filter(
    (item) => values.ownOptions[item].length
  ).length
  if (!maxLevel) {
    table.push(priceBlock([...crumbs]))
  } else {
    const deepToOptions = (optionValues) => {
      level++
      if (level > maxLevel) {
        level--

        return
      } else {
        Object.keys(optionValues).forEach((item) => {
          const style = {
            paddingLeft: level * 50 + "px",
          }
          if (level === maxLevel) {
            crumbs.push(item)
            table.push(
              <div style={style} className={styles.last_option}>
                <div>{item}</div>
                <div>{priceBlock([...crumbs])}</div>
              </div>
            )

            crumbs.pop()
          } else {
            table.push(<div style={style}>{item} </div>)
            crumbs.push(item)
            deepToOptions(optionValues[item])
            crumbs.pop()
          }
        })
      }
      level--
    }
    deepToOptions(values.optionValues)
  }
  
  return <div className={styles.container}>{table}</div>
}
