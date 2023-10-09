import React, { useState } from 'react'
import { getCurrencySymbol, getStringPrice } from 'utils'
import styles from '@/styles/ProductPriceBlock.module.scss'
import { FaCaretSquareUp, FaChevronDown, FaChevronUp } from 'react-icons/fa'

export default function ProductPriceBlock({ product, arr, setValues }) {

  const [inputValue,setInputValue]=useState('')
  let rez = product.optionValues
  arr.forEach(item => {
    rez = rez[item]    
  })  
  const price = rez.price + ' ' + getCurrencySymbol(product.currencyValue)
  
  const handleChange = (e) => {
    e.preventDefault()
    setInputValue(e.target.value)
    
  }
  const increment = (e) => {
    e.preventDefault()
    setInputValue((prev)=>prev+1)
  }
  const decrement = (e) => {
     e.preventDefault()
    setInputValue(prev=>prev-1)
  }
  console.log(inputValue,arr)
  return (
    <div className={styles.flex_block}>
      <div>
        
        <FaChevronDown onClick={increment } />
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          maxLength={3}
        />
        
        <FaChevronUp onClick={ decrement} />
      </div>
      <div >{price}</div>
    </div>
  )
}
