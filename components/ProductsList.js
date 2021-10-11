import Link from "next/link"
import styles from "@/styles/ProductList.module.css"
import { API_URL, NOIMAGE } from "@/config/index"
import { CgEnter } from "react-icons/cg"
import { getCurrencySymbol, getPriceForShow, getShortDescription } from "utils"
import { useContext, useEffect, useState } from "react"
import ProductsContext from "@/context/ProductsContext"
import useSWR from "swr"
import Loupe from "./Loupe"

export default function ProductsList({ products = [], isShowAsList }) {
  const [innerWidth, setInnerWidth] = useState(0)
  useEffect(() => {
    setInnerWidth(window.innerWidth)
  }, [])

  const { currencyShop } = useContext(ProductsContext)
  const [isShow, setIsShow] = useState(false)
  const [image, setImage] = useState("")
  const fakeArray=['','','','','','']
  const addToCart = () => {
    console.log("cart")
  }

  const { data } = useSWR(`${API_URL}/api/currencyrate`)

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
                    <Link href={`/product/${item.slug}`} key={i}>
                      <tr>
                        <td>
                          <div className={styles.image}>
                            <img
                              src={
                                item.imagesSm.length
                                  ? `${API_URL}${item.imagesSm[0]}`
                                  : `${NOIMAGE}`
                              }
                              alt={"no image"}
                              onClick={(e) => {
                                e.stopPropagation()
                                setIsShow(true)
                                setImage(
                                  item.images[0]                                   
                                )
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
                          {getShortDescription(
                            item.description,
                            innerWidth / 15
                          )}
                        </td>
                        <td>
                          {item.price && data ? (
                            <div>
                              {getPriceForShow({
                                currencyRate: data.currencyRate,
                                currencyShop,
                                price: item.price,
                                currencyValue: item.currencyValue,
                              })}
                              &nbsp;{getCurrencySymbol(currencyShop)}
                            </div>
                          ) : (
                            <div>&nbsp;</div>
                          )}
                        </td>
                      </tr>
                    </Link>
                  ))
                : null}
            </tbody>
          </table>
          {isShow ? <Loupe image={image} setIsShow={setIsShow} /> : null}
        </div>
      ) : (
        <div className={styles.container}>
          {products.map((item, i) => (
            <div className={styles.card_wrapper} key={i}>
              <Link href={`/product/${item.slug}`}>
                <div className={styles.card}>
                  <div className={styles.image_card}>
                    <img
                      src={
                        item.imagesMd.length
                          ? `${API_URL}${item.imagesMd[0]}`
                          : `${NOIMAGE}`
                      }
                      alt="No image"
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsShow(true)
                        setImage(
                          item.images[0] 
                        )
                      }}
                    />

                    <p className={styles.name_card}>{item.name}</p>
                  </div>

                  <div className={styles.footer_card}>
                    {item.price && data ? (
                      <p>
                      {getPriceForShow({
                        currencyRate: data.currencyRate,
                        currencyShop,
                        price: item.price,
                        currencyValue: item.currencyValue,
                      })}
                      &nbsp;{getCurrencySymbol(currencyShop)}
                    </p>
                    ):(<p>&nbsp;</p>)}
                    
                  </div>
                </div>
              </Link>
            </div>
          ))}
            {fakeArray.map((item, i) => (
              <div className={styles.fake_image} key={i}></div>
            ))}
          {isShow ? <Loupe image={image} setIsShow={setIsShow} /> : null}
        </div>
      )}
    </>
  )
}