import React, { useEffect, useState } from "react"
import ProductPriceBlock from "./ProductPriceBlock"
import ProductOptionsInTable from "./ProductOptionsInTable"
import styles from '@/styles/ProductTable.module.scss'
import { getCurrencySymbol } from "utils"

export default function ProductTable({ product, setValues,values }) {
 
  
  useEffect(() => {
    // делаем таблицу полосатой
    const elements = document.querySelectorAll(".option" )

    elements.forEach((elem, key) => {
      if (key % 2) {
        elem.style.backgroundColor = "#F4F6F6"
      } else {
        elem.style.backgroundColor = "#E5E8E8"
      }
    })
  })

  const crumbs = []
  const level = 0
  const maxLevel = Object.keys(product.ownOptions).filter(
    (item) => product.ownOptions[item].length
  ).length
  
  return (
    <div className={styles.container}>
      {!maxLevel ? (
        <div className={styles.price_block_along}>
          
          <ProductPriceBlock product={product} arr={crumbs} setValues={setValues} values={ values} />
        </div>
      ) : (
        <ProductOptionsInTable
            crumbs={crumbs}
            level={level}
            maxLevel={maxLevel}
            product={product}
            optionValues={product.optionValues}
            setValues={setValues}
            values={values}
        />
      )}
     
    </div>
  )
}
