import styles from "@/styles/Showcase.module.scss"
import { API_URL, NOIMAGE } from "../config"
import { getCurrencySymbol, getPriceForShow, getStringPrice } from "utils"
import ProductsContext from "@/context/ProductsContext"
import { useContext, useState } from "react"
import Loupe from "./Loupe"
import { useRouter } from "next/router"

export default function Showcase({ showcaseProducts }) {
  const { currencyShop, currencyRate } = useContext(ProductsContext)
  const [image, setImage] = useState("")
  const [isShow, setIsShow] = useState(false)
  const router = useRouter()
 
  return (
    <div className={styles.container}>
      {showcaseProducts.length
        ? showcaseProducts.map((product, i) => (
            <div
              onClick={() => router.push(`/product/${product.slug}`)}
              key={i}
            >
              <div className={styles.item}>
                <div className={styles.header}>
                  <img
                    src={
                      product.imagesMd.length
                        ? `${API_URL}${product.imagesMd[0]}`
                        : `${NOIMAGE}`
                    }
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
                  {Object.keys(currencyRate).length ? (
                    <p>
                      {getPriceForShow({currencyRate,currencyShop,product})} {getCurrencySymbol(currencyShop)}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          ))
        : null}
      {isShow ? <Loupe image={image} setIsShow={setIsShow} /> : null}
    </div>
  )
}
