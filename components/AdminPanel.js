import styles from "@/styles/AdminPanel.module.scss"
import AuthContext from "@/context/AuthContext"
import { useContext, useEffect, useState } from "react"
import Link from "next/link"
import { API_URL } from "../config"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import ProductsContext from "@/context/ProductsContext"

export default function AdminPanel() {
  const {
    user: { isAdmin, token },
  } = useContext(AuthContext)
  const { currencyRate, setCurrencyRate }=useContext(ProductsContext)  
  const [values, setValues] = useState({
    USD: "",
    EUR: "",
  })
  useEffect(() => {
    setValues({
      USD: Object.keys(currencyRate).length ? currencyRate.USD.toString() : "",
      EUR: Object.keys(currencyRate).length ? currencyRate.EUR.toString() : "",
    })
  }, [currencyRate])

  const handleChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    if (isNaN(value)) {
      return
    }
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
    
    setCurrencyRate(data)
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
              <Link href="/edit_category">
                <li>Редактировать</li>
              </Link>
            </ul>
          </div>         
          <div className={styles.container_item}>
            Каталоги
            <ul className={styles.dropdown_list}>
              <Link href="/add_catalog">
                <li>Добавить</li>
              </Link>
              <Link href="/edit_catalog">
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
              <Link href="edit_product">
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
            <div className={styles.single_link}>
              <div className={styles.container_item}>Заказы</div>
            </div>
          </Link>
          <Link href="edit_information">
            <div className={styles.single_link}>
              <div className={styles.container_item}>Информация</div>
            </div>
          </Link>
        </div>
      ) : null}
    </div>
  )
}
