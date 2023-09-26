import React, { useEffect, useState } from "react"
import styles from "@/styles/PriceTable.module.scss"
import InputPriceBlock from "./InputPriceBlock"
import OptionInTable from "./OptionInTable"

export default function PriceTable({ values, setValues }) {

  useEffect(() => {
    // делаем таблицу полосатой
    const elements = document.querySelectorAll([
       ".option",
      ".OptionInTable_last_option__qLu2l"
    ]
     
    ) 
    elements.forEach((elem,key) => {
      if (key % 2) {
        elem.style.backgroundColor = "#F8F9F9 "
      } else {
        elem.style.backgroundColor = "#E5E8E8 "
      }
    })
  })
  
  
  let level = 0
  const crumbs = []

  const maxLevel = Object.keys(values.ownOptions).filter(
    (item) => values.ownOptions[item].length
  ).length
  
  return (
    <div className={styles.container}>
      {!maxLevel ? (
        <InputPriceBlock
          arr={[...crumbs]}
          values={values}
          setValues={setValues}
        />
      ) : (
        <OptionInTable
          level={level}
          maxLevel={maxLevel}
          crumbs={[...crumbs]}
          optionValues={values.optionValues}
          values={values}
          setValues={setValues}
        />
      )}
    </div>
  )
}
