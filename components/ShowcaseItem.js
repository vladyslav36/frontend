import Image from "next/image"
import Link from "next/link"
import { API_URL } from "@/config/index"
import styles from '@/styles/showcaseItem.module.css'
import { FaShoppingCart } from "react-icons/fa"
import { getCurrencySymbol }from 'utils'


export default function ShowcaseItem({product}) {
  return (
    <div className={styles.item}>
      <Image src={`${API_URL}${product.image}`} width={400} height={600} />
      <div className={styles.name}><h4>{product.name}</h4></div>
      <div className={styles.footer}>        
        <div><p>{product.price.toFixed(2)} {getCurrencySymbol(product.currencyValue)}</p></div>
        <div><Link href='#'><a><FaShoppingCart/> Купить</a></Link></div>
      </div>             
    </div>
  )
}

