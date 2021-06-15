import styles from "@/styles/AdminPanel.module.css"
import AuthContext from "@/context/AuthContext"
import ProductsContext from "@/context/ProductsContext"
import { useContext, useEffect, useState } from "react"
import Link from "next/link"

import { API_URL } from "../config"

export default function AdminPanel() {
  const {
    user: { isAdmin },
  } = useContext(AuthContext)
  const { currencyRate, setCurrencyRate } = useContext(ProductsContext)

  const [values, setValues] = useState({
    USD: currencyRate.USD.toString(),
    EUR: currencyRate.EUR.toString(),
  })

  useEffect(() => {
    setValues({
      USD: currencyRate.USD.toString(),
      EUR: currencyRate.EUR.toString(),
    })
  }, [currencyRate])

  const handleChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    setValues({ ...values, [name]: value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    const valuesToSend={USD:+values.USD,EUR:+values.EUR}
    // send data
    const res = await fetch(`${API_URL}/api/currencyrate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(valuesToSend),
    })
    const data = await res.json()
    
    setCurrencyRate({ ...currencyRate, USD: data.USD, EUR: data.EUR })
  }

  return (
    <div>
      {isAdmin ? (
        <div className={styles.container}>
          <div className={styles.container_item}>
            Бренд
            <ul className={styles.dropdown_list}>
              <Link href="/add_brand">
                <li>Добавить</li>
              </Link>
              <Link href="/edit_brand_list">
                <li>Редактировать</li>
              </Link>
            </ul>
          </div>
          <div className={styles.container_item}>
            Категории
            <ul className={styles.dropdown_list}>
              <Link href="/add_category">
                <li>Добавить</li>
              </Link>
              <Link href="/edit_category_list">
                <li>Редактировать</li>
              </Link>
            </ul>
          </div>
          <div className={styles.container_item}>
            Товар
            <ul className={styles.dropdown_list}>
              <Link href="add_product">
                <li>Добавить</li>
              </Link>
              <Link href="edit_product_list">
                <li>Редактировать</li>
              </Link>
            </ul>
          </div>
          <div className={styles.container_item}>
            Опции
            <ul className={styles.dropdown_list}>
              <li>Добавить</li>
              <li>Редактировать</li>
            </ul>
          </div>
          <div className={styles.container_item}>
            Курс валют
            <form onSubmit={handleSubmit}>
              <ul className={styles.dropdown_list}>
                <li>
                  <p> USD</p>

                  <input
                    type="text"
                    name="USD"
                    value={values.USD}
                    onChange={handleChange}
                  />
                </li>
                <li>
                  <p>EUR</p>
                  <input
                    type="text"
                    name="EUR"
                    value={values.EUR}
                    onChange={handleChange}
                  />
                </li>
                <button
                  type="submit"
                  className={"btn" + " " + styles.btn_submit}
                >
                  Сохранить
                </button>
              </ul>
            </form>
          </div>
          <div className={styles.container_item}>
            Пользователь
            <ul className={styles.dropdown_list}>
              <li>Добавить</li>
              <li>Редактировать</li>
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  )
}
