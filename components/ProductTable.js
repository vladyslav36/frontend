import React, { useEffect } from "react"
import ProductPriceBlock from "./ProductPriceBlock"
import ProductOptionsInTable from "./ProductOptionsInTable"
import styles from '@/styles/ProductTable.module.scss'

export default function ProductTable({ product, setValues }) {
  console.log(product)
  useEffect(() => {
    // делаем таблицу полосатой
    const elements = document.querySelectorAll([
      ".option",
      ".ProductOptionsInTable_last_option__v49OI",
    ])

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
        <ProductPriceBlock product={product } />
      ) : (
        <ProductOptionsInTable
          crumbs={crumbs}
          level={level}
            maxLevel={maxLevel}
            product={product}
          optionValues={product.optionValues}
          setValues={setValues}
        />
      )}
    </div>
  )
}
