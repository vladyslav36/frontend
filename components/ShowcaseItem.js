import Image from "next/image"
import Link from "next/link"
import { API_URL } from "@/config/index"
import styles from '@/styles/showcaseItem.module.css'
import { FaShoppingCart } from "react-icons/fa"
import { getCurrencySymbol,getPriceForShow } from 'utils'
import AuthContext from '@/context/AuthContext'
import { useContext } from 'react'


export default function ShowcaseItem({ product:{currencyValue,name,image,price} }) {
  const { currencyRate,currencyShop } = useContext(AuthContext)
  
  const priceForShow=getPriceForShow({currencyRate,currencyShop,price,currencyValue})
  return (
    <div className={styles.item}>
      <Image src={`${API_URL}${image}`} width={400} height={600} />
      <div className={styles.name}><h4>{name}</h4></div>
      <div className={styles.footer}>        
        <div><p>{priceForShow} {getCurrencySymbol(currencyShop)}</p></div>
        <div><Link href='#'><a><FaShoppingCart/> Купить</a></Link></div>
      </div>             
    </div>
  )
}

