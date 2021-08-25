import styles from "@/styles/ProductList.module.css"
import { API_URL } from "@/config/index"
import Link from "next/link"
import { FaShoppingCart } from "react-icons/fa"
import { getCurrencySymbol, getPriceForShow, getShortDescription } from "utils"
import { useContext, useEffect, useState } from "react"
import ProductsContext from "@/context/ProductsContext"


export default function ProductList({ products }) {
 
  const [innerWidth,setInnerWidth]=useState(0)
  useEffect(() => {
    setInnerWidth(window.innerWidth)
  },[])
  
  
  const { currencyRate, currencyShop } = useContext(ProductsContext)
  const addToCart = () => {
    console.log("cart")
  }
  
  return (
    <div className={styles.grid}>
      <div>&nbsp;</div>
      <div>Название</div>
      <div>Модель</div>
      <div>Описание</div>
      <div>Цена</div>
      <div>Купить</div>
      <div className={styles.line}></div>
      {products.map((product) => (
        <div key={product._id} className={styles.grid_product}>
          <Link href={`/product/${product.slug}`}>
            <a className={styles.image}>
              <img
                src={`${API_URL}${product.image}` } alt={'no image'}               
              />
            </a>
          </Link>
          <Link href={`/product/${product.slug}`}>
           
              <div className={styles.name_link}>{product.name}</div>
                       
          </Link>
          
          <div>{product.model}</div>
          <div>{getShortDescription(product.description,innerWidth/15)}</div>
          {product.price ? (
            <div>              
              {getPriceForShow({
                currencyRate,
                currencyShop,
                price:product.price,
                currencyValue:product.currencyValue,
              })}&nbsp;{getCurrencySymbol(product.currencyValue)}
            </div>
          ):(<div>&nbsp;</div>)}
          <button className={styles.button}>
            <FaShoppingCart />
          </button>
          <div className={styles.line}></div>
        </div>
      ))}
    </div>
  )
}
