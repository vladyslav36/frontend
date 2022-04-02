import Layout from '@/components/Layout'
import Link from 'next/link'
import styles from "@/styles/ProductList.module.css"
import { API_URL } from "@/config/index"
import { FaShoppingCart } from "react-icons/fa"
import { getCurrencySymbol, getPriceForShow, getShortDescription } from "utils"
import { useContext, useEffect, useState } from "react"
import ProductsContext from "@/context/ProductsContext"

export default function ProductListPage() {  
  const { productList:products } = useContext(ProductsContext)
  const [innerWidth, setInnerWidth] = useState(0)
  useEffect(() => {
    setInnerWidth(window.innerWidth)
  }, [])

  const { currencyRate, currencyShop } = useContext(ProductsContext)
  const addToCart = () => {
    console.log("cart")
  }
  return (
    <Layout title="Список товаров">
      <Link href="/">Вернуться на главную</Link>
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
          {products&&products.length
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
    </Layout>
  )
}
