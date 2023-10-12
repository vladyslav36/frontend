import React, { useEffect, useState } from "react"
import ProductPriceBlock from "./ProductPriceBlock"
import ProductOptionsInTable from "./ProductOptionsInTable"
import styles from '@/styles/ProductTable.module.scss'
import { getCurrencySymbol } from "utils"

export default function ProductTable({ product, setValues,values }) {
  const [qntAmount, setQntAmount] = useState({ qnt: '', amount: '' })
  
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

  useEffect(() => {
    let totalQnt = 0
    let amount = 0
    const tableObj = values
    const deep = (optionValues) => {
      if ('price' in optionValues) {
        let qnt = parseInt(optionValues.qnt) || 0
        totalQnt+=qnt
        amount += (parseFloat(optionValues.price) || 0) * qnt
        return
      } else {
        Object.keys(optionValues).forEach(item => {
          deep(optionValues[item])
        })
      }
    }
    deep(tableObj)
    totalQnt = totalQnt.toString()
    amount=amount.toFixed(2)+' '+getCurrencySymbol(product.currencyValue)
    setQntAmount({qnt:totalQnt,amount})
  },[values])

  const crumbs = []
  const level = 0
  const maxLevel = Object.keys(product.ownOptions).filter(
    (item) => product.ownOptions[item].length
  ).length
  return (
    <div className={styles.container}>
      {!maxLevel ? (
        <ProductPriceBlock product={product} arr={crumbs} setValues={setValues} values={ values} />
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
      <div className={styles.footer}>
        <p>Выбрано: {qntAmount.qnt }</p>
        <p>Сумма: {qntAmount.amount}</p>
      </div>
    </div>
  )
}
