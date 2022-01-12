import styles from "@/styles/AdminPanel.module.css"
import AuthContext from "@/context/AuthContext"
import { useContext, useEffect, useState } from "react"
import Link from "next/link"
import { API_URL } from "../config"
import useSWR, { mutate } from "swr"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function AdminPanel() {
  const {
    user: { isAdmin, token },
  } = useContext(AuthContext)

  
  const { data } = useSWR(`${API_URL}/api/currencyrate`)
  const [values, setValues] = useState({
    USD: "",
    EUR: "",
  })
  useEffect(() => {
    setValues({
      USD: data ? data.currencyRate.USD.toString() : "",
      EUR: data ? data.currencyRate.EUR.toString() : "",
    })
  }, [data])

  const handleChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    setValues({ ...values, [name]: value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    const valuesToSend = { USD: +values.USD, EUR: +values.EUR }

    // send data
    const res = await fetch(`${API_URL}/api/currencyrate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(valuesToSend),
    })
    const data = await res.json()
    if (!res.ok) {
      toast.error(data.message)
    }
    mutate(`${API_URL}/api/currencyrate`)
  }

  return (
    <div>
      <ToastContainer />
      {isAdmin ? (
        <div className={styles.container}>
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
            Опции
            <ul className={styles.dropdown_list}>
              <Link href="/add_option">
                <li>Добавить</li>
              </Link>
              <Link href="/edit_option_list">
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
          

          <Link href="order_admin_list">
            <a className={styles.single_link}>
              <div className={styles.container_item}>Заказы</div>
            </a>
          </Link>
        </div>
      ) : null}
    </div>
  )
}
