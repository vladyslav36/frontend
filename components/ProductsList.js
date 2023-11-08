import styles from "@/styles/ProductList.module.scss"
import { API_URL, NOIMAGE } from "@/config/index"
import { getCurrencySymbol, getPriceForShow, getShortDescription } from "utils"
import { useContext, useEffect, useState } from "react"
import ProductsContext from "@/context/ProductsContext"

import Loupe from "./Loupe"
import { useRouter } from "next/router"


export default function ProductsList({ products = [], isShowAsList }) {
  const [innerWidth, setInnerWidth] = useState(0)
  const router=useRouter()
  useEffect(() => {
    setInnerWidth(window.innerWidth)
  }, [])

  const { currencyShop,currencyRate } = useContext(ProductsContext)  
  const [isShow, setIsShow] = useState(false)
  const [image, setImage] = useState("")  
  

  return (
    <>
      {isShowAsList ? (
        <div className={styles.table_wrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>&nbsp;</th>
                <th>Название</th>
                <th>Модель</th>
                <th>Описание</th>
                <th>Цена</th>
              </tr>
            </thead>
            <tbody>
              {products.length
                ? products.map((item, i) => (
                    <tr
                      onClick={() => router.push(`/product/${item.slug}`)}
                      key={i}
                    >
                      <td>
                        <div className={styles.image}>
                          <img
                            src={
                              item.imagesSm.length
                                ? `${API_URL}${item.imagesSm[0]}`
                                : `${NOIMAGE}`
                            }
                            onClick={(e) => {
                              e.stopPropagation()
                              setIsShow(true)
                              setImage(item.images[0])
                            }}
                          />
                        </div>
                      </td>
                      <td>
                        <p>{item.name}</p>
                      </td>
                      <td>
                        <p>{item.model}</p>
                      </td>
                      <td>
                        {getShortDescription(item.description, innerWidth / 15)}
                      </td>
                      <td>
                        { currencyRate ? (
                          <div>
                            {getPriceForShow({
                              currencyRate,
                              currencyShop,
                            product: item
                            })}
                            &nbsp;{getCurrencySymbol(currencyShop)}
                          </div>
                        ) : (
                          <div>&nbsp;</div>
                        )}
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
          {isShow ? <Loupe image={image} setIsShow={setIsShow} /> : null}
        </div>
      ) : (
        <div className={styles.container}>
            {products.map((item, i) => (           
              <div className={styles.card} onClick={() => router.push(`/product/${item.slug}`)} key={i}>
                <div className={styles.image_card}>
                  <img
                    src={
                      item.imagesMd.length
                        ? `${API_URL}${item.imagesMd[0]}`
                        : `${NOIMAGE}`
                    }
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsShow(true)
                      setImage(item.images[0])
                    }}
                  />

                  <p className={styles.name_card}>{item.name}</p>
                </div>

                <div className={styles.footer_card}>
                  { currencyRate ? (
                    <p>
                      {getPriceForShow({
                        currencyRate,
                        currencyShop,
                       product:item
                      })}
                      &nbsp;{getCurrencySymbol(currencyShop)}
                    </p>
                  ) : (
                    <p>&nbsp;</p>
                  )}
                </div>
              </div>
            
          ))}

          {isShow ? <Loupe image={image} setIsShow={setIsShow} /> : null}
        </div>
      )}
    </>
  )
}
