import styles from "@/styles/ProductList.module.css"
import { API_URL } from "@/config/index"
import Image from "next/image"
import useSWR from "swr"
import Link from "next/link"
import { FaShoppingCart } from "react-icons/fa"
import { getCurrencySymbol, getPriceForShow, getShortDescription } from "utils"
import { useContext, useEffect, useState } from "react"
import ProductsContext from "@/context/ProductsContext"


export default function ProductList({ categoryId }) {

  const [innerWidth,setInnerWidth]=useState(0)
  useEffect(() => {
    setInnerWidth(window.innerWidth)
  },[])
  
  console.log(innerWidth)
  const { currencyRate, currencyShop } = useContext(ProductsContext)
 
  const fetcher = (...arg) => fetch(...arg).then((res) => res.json())
  const { data, error } = useSWR(
    // `${API_URL}/api/products/category/${categoryId}`,
    `${API_URL}/api/products/`,
    fetcher
  )

  const addToCart = () => {
    console.log("cart")
  }
  if (error) return <div>Error</div>
  if (!data) return <div>Loading...</div>
  const { products } = data
  console.log(products)
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
              <Image
                src={`${API_URL}${product.image}` } alt={'no image'}
                width={55}
                height={70}
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
