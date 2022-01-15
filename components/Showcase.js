import styles from "@/styles/Showcase.module.css"
import { API_URL, NOIMAGE } from "../config"
import Link from "next/link"
import { getCurrencySymbol, getPriceForShow } from "utils"
import ProductsContext from "@/context/ProductsContext"
import { useContext, useState } from "react"
import Loupe from "./Loupe"
import useSWR from "swr"



export default function Showcase() {
  const { currencyShop } = useContext(ProductsContext)  
  const [image, setImage] = useState("")
  const [isShow, setIsShow] = useState(false)
  const fakeImages = ["", "", "", "", ""]

  const { data: dataRate } = useSWR(`${API_URL}/api/currencyrate`)
 
  const { data: dataShow } = useSWR(`${API_URL}/api/products/showcase`)
  
  
  return (
    <div className={styles.container}>
      <>
        {dataShow?dataShow.showcaseProducts.map((product, i) => (
          <Link href={`/product/${product.slug}`} key={i}>
            <div>
              <div className={styles.item}>
                <div className={styles.header}>
                  <img
                    src={
                      product.imagesMd.length
                        ? `${API_URL}${product.imagesMd[0]}`
                        : `${NOIMAGE}`
                    }
                    alt="No image"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsShow(true)
                      setImage(product.images[0])
                    }}
                  />
                  <div className={styles.name}>
                    <p>{product.name}</p>
                  </div>
                </div>

                <div className={styles.footer}>
                  {dataRate ? (
                      <p>
                    {getPriceForShow({
                      currencyRate:dataRate.currencyRate,
                      currencyShop,
                      price: product.price,
                      currencyValue: product.currencyValue,
                    })}{" "}
                    {getCurrencySymbol(currencyShop)}
                  </p>
                    ):null}
                  
                    
                </div>
              </div>
               
              {isShow ? <Loupe image={image} setIsShow={setIsShow} /> : null}
            </div>
          </Link>
        )):null}
          
        {fakeImages.map((item, i) => (
                  <div className={styles.fake_image} key={i}></div>
        ))}
        </>
    </div>    
      
  )
}
