import Layout from "@/components/Layout"
import Link from "next/link"
import styles from "@/styles/ProductList.module.css"
import { API_URL } from "@/config/index"
import { FaShoppingCart } from "react-icons/fa"
import { getCurrencySymbol, getPriceForShow, getShortDescription } from "utils"
import { useContext, useEffect, useState } from "react"
import ProductsContext from "@/context/ProductsContext"

export default function ProductsList({ products = [],isShowAsList }) {
  
  const [innerWidth, setInnerWidth] = useState(0)
  useEffect(() => {
    setInnerWidth(window.innerWidth)
  }, [])

  const { currencyRate, currencyShop } = useContext(ProductsContext)
  const addToCart = () => {
    console.log("cart")
  }
  return (
    <>
      {isShowAsList ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>&nbsp;</th>
              <th>Название</th>
              <th>Модель</th>
              <th>Описание</th>
              <th>Цена</th>
              <th>Купить</th>
            </tr>
          </thead>
          <tbody>
            {products.length
              ? products.map((item, i) => (
                  <tr key={i}>
                    <td>
                      <div className={styles.image}>
                        <Link href={`/product/${item.slug}`}>
                          <img
                            src={
                              item.imagesSm.length
                                ? `${API_URL}${item.imagesSm[0]}`
                                : "noimage.png"
                            }
                            alt={"no image"}
                          />
                        </Link>
                      </div>
                    </td>
                    <td>
                      <Link href={`/product/${item.slug}`}>
                        <a className={styles.name}>{item.name}</a>
                      </Link>
                    </td>
                    <td>{item.model}</td>
                    <td>
                      {getShortDescription(item.description, innerWidth / 15)}
                    </td>
                    <td>
                      {item.price ? (
                        <div>
                          {getPriceForShow({
                            currencyRate,
                            currencyShop,
                            price: item.price,
                            currencyValue: item.currencyValue,
                          })}
                          &nbsp;{getCurrencySymbol(item.currencyValue)}
                        </div>
                      ) : (
                        <div>&nbsp;</div>
                      )}
                    </td>
                    <td>
                      <div className={styles.button}>
                        <button>
                          <FaShoppingCart />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      ) : (
        <div className={styles.container}>
          {products.map((item, i) => (
            <Link href={`/product/${item.slug}`}>
              <div className={styles.card}>
                <div className={styles.image_card}>
                  <img
                    src={
                      item.imagesMd.length
                        ? `${API_URL}${item.imagesMd[0]}`
                        : "noimage.png"
                    }
                    alt="No image"
                  />
                  <div className={styles.name_card}>{item.name}</div>
                </div>

                <div className={styles.footer_card}>
                  <div className={styles.price_card}>
                    {item.price}&nbsp;{getCurrencySymbol(item.currencyValue)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
