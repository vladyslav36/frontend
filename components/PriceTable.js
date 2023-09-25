import React, { useState } from "react"
import styles from "@/styles/PriceTable.module.scss"

export default function PriceTable({ values, setValues }) {
  const [inputValues,setInputValues]=useState(JSON.parse(JSON.stringify(values.optionValues)))
  console.log(values.optionValues)
  const priceBlock = (
    
       <div className={styles.price_block}>
      <input type="text" id="price" placeholder="Цена" />
      <input type="text" id="barcode" placeholder="Штрихкод" />
      </div>      
    
   
  )
  const table = []
  let level = 0
  const crumbsArr=[]
  const maxLevel=Object.keys(values.ownOptions).filter(item=>values.ownOptions[item].length).length
  if (!maxLevel) {
    table.push(priceBlock)
  } else {
     const deepToOptions = (optionValues) => {
       level++
       if (level>maxLevel) {         
         level--
         return
       } else {
         Object.keys(optionValues).forEach((item) => {
           
              const style = {
             paddingLeft: level * 50 + "px",
        
           }
           if (level===maxLevel){
          
             table.push(<div style={style} className={styles.last_option}>
               <div>{item}</div> 
               <div>{ priceBlock}</div> 
             </div>)
           } else {
             table.push(<div style={style}>{item} </div>)
             deepToOptions(optionValues[item])
           }
           console.log(crumbsArr)
           
         })
       }
       level--
      
     }
     deepToOptions(values.optionValues)
  }
 console.log(inputValues)
  return (
     <div className={styles.container}>
    {table}
  </div>
  )
 
}
