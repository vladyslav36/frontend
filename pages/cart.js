import styles from "@/styles/Cart.module.css"

import { useContext, useState } from "react"
import AuthContext from "@/context/AuthContext"
import ProductsContext from "@/context/ProductsContext"
import Layout from "@/components/Layout"
import { FaTimes } from "react-icons/fa"
import { getCurrencySymbol, getQntInCart, getTotalInCart } from "utils"
import Links from "@/components/Links"
import router from "next/router"

export default function Cart() {
  const { cart, setCart } = useContext(ProductsContext)  

  const getTotalAmount = (cart) => {
    const totalObj = getTotalInCart(cart)
    let strArr = []
    for (let key in totalObj) {
      if (totalObj[key]) {
        strArr.push(`${totalObj[key].toFixed(2)}${getCurrencySymbol(key)}`)
      }
    }
    return strArr.join(" + ") || "0"
  }
  const isAttrInCart = (attr) => {
    return cart.some((item) => item[attr] !== "")
  }

  const handleCheckout = () => {
    router.push('/checkout')
  }
  return (
    <Layout title="Корзина">
      <div className={styles.header}>
        <Links home={true} back={true} />
        <div className={styles.checkout}>
          <button onClick={handleCheckout}>Оформить заказ</button>
        </div>
      </div>

      <div className={styles.table}>
        <table>
          <thead>
            <tr>
              <td>Модель</td>
              <td
                style={
                  isAttrInCart("height")
                    ? {}
                    : { visibility: "hidden", width: 0 }
                }
              >
                Рост
              </td>
              <td
                style={
                  isAttrInCart("size") ? {} : { visibility: "hidden", width: 0 }
                }
              >
                Размер
              </td>
              <td
                style={
                  isAttrInCart("color")
                    ? {}
                    : { visibility: "hidden", width: 0 }
                }
              >
                Цвет
              </td>
              <td>Цена</td>
              <td>Кол-во</td>
              <td>
                <div className={styles.delete_btn}>
                  <FaTimes
                    title="Очистить корзину"
                    onClick={() => setCart([])}
                  />
                </div>
              </td>
            </tr>
          </thead>
          <tbody>
            {cart && cart.length ? (
              cart.map((item, i) => (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td>{item.height}</td>
                  <td>{item.size}</td>
                  <td>{item.color}</td>
                  <td>
                    {item.price}&nbsp;{getCurrencySymbol(item.currencyValue)}
                  </td>
                  <td>{item.qnt}</td>
                  <td>
                    <div className={styles.delete_btn}>
                      <FaTimes
                        title="Удалить строку"
                        onClick={() =>
                          setCart(cart.filter((item, idx) => i !== idx))
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td>&nbsp;</td>
              </tr>
            )}
            <tr>
              <td colSpan="7">
                <div className={styles.table_bottom}>
                  <p>Всего товаров:&nbsp;{cart ? getQntInCart(cart) : ""}</p>
                  <p>Сумма заказа:{cart ? getTotalAmount(cart) : ""}</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Layout>
  )
}
