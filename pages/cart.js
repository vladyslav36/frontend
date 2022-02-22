import styles from "@/styles/Cart.module.css"

import { useContext, useState } from "react"
import AuthContext from "@/context/AuthContext"
import ProductsContext from "@/context/ProductsContext"
import Layout from "@/components/Layout"
import { FaTimes } from "react-icons/fa"
import { getCurrencySymbol, getQntInCart,getTotalAmount } from "utils"
import Links from "@/components/Links"
import router from "next/router"

export default function Cart() {
  const { cart, setCart } = useContext(ProductsContext)  

  // optionList собирает все возможные опции из корзины  
  const optionList = cart.length ? (cart.reduce((acc, item) => {
    const itemOptions = Object.keys(item.options)
    itemOptions.forEach(option => {
      if (!acc.includes(option)) acc.push(option)
      
    })
    return acc
  }, [])) : []
  

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
              {optionList.length ? (
                optionList.map((item, i) => (
                  <td key={i}>
                    { item}
                  </td>
                ))
              ):null}
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
                  {optionList.length ? optionList.map((option, i) => (
                    <td key={i}>
                      {item.options[option]}
                    </td>
                  )):null}
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
