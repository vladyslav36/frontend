import styles from "@/styles/Checkout.module.scss"
import Layout from "@/components/Layout"
import Links from "@/components/Links"
import AuthContext from "@/context/AuthContext"
import ProductsContext from "@/context/ProductsContext"
import { useContext, useEffect, useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { formatingPhone, getQntInCart, getTotalAmount } from "utils"
import { API_URL } from "../config"

export default function Checkout() {
  const { cart, setCart } = useContext(ProductsContext)
  const { user } = useContext(AuthContext)
  const [values, setValues] = useState({
    name: "",
    surname: "",
    phone: "",
    city: "",
    carrier: "",
    branch: "",
    pickup: true,
    prepaid: true,
  })
  const [disable, setDisable] = useState(false)

  useEffect(() => {
    if (Object.keys(user).length) {
      const { name, surname, phone, city, carrier, branch } = user.delivery
      setValues({ ...values, name, surname, phone, city, carrier, branch })
    } else {
      const data = localStorage.getItem("checkout")
      if (data) setValues(JSON.parse(data))
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === "delMethod") {
      setValues({
        ...values,
        ["pickup"]: value === "pickup",
      })
    } else {
      if (name === "payment") {
        setValues({
          ...values,
          ["prepaid"]: value === "prepaid",
        })
      } else {
        e.preventDefault()
        setValues({ ...values, [name]: value })
      }
    }
  }

  const handleSendOrder = async () => {
    const totalAmount = getTotalAmount(cart)
    const totalQnt = getQntInCart(cart)   

    localStorage.setItem("checkout", JSON.stringify(values))   

    const res = await fetch(`${API_URL}/api/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderItems: cart,
        delivery: values,
        totalQnt,
        totalAmount,
        userId: Object.keys(user).length ? user._id : null,
      }),
    })
    const data=await res.json()
    if (res.ok) {
      toast.success("Заказ обработан успешно")
      setCart([])
      setDisable(true)
    } else {
      toast.error(data.message)
    }
  }

  return (
    <Layout title="Оформление заказа">
      <ToastContainer />
      <div className={styles.container}>
        <div className={styles.header}>
          <Links home={true} back={true} />
          <button
            className={styles.button}
            onClick={handleSendOrder}
            disabled={disable}
          >
            Отправить заказ
          </button>
        </div>
        <div className={styles.content}>
          <div className={styles.input}>
            <label htmlFor="name">Имя получателя</label>
            <input
              type="text"
              id="name"
              name="name"
              maxLength="20"
              value={values.name}
              onChange={handleChange}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="surname">Фамилия получателя</label>
            <input
              type="text"
              id="surname"
              name="surname"
              maxLength="20"
              value={values.surname}
              onChange={handleChange}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="phone">Телефон</label>
            <input
              type="text"
              id="phone"
              name="phone"
              maxLength="15"
              value={values.phone}
              onChange={(e) =>
                setValues({ ...values, phone: formatingPhone(e.target.value) })
              }
            />
          </div>
          <div className={styles.input}>
            <p> Способ доставки</p>
            <div className={styles.input_radio_wrapper}>
              <div className={styles.input_radio}>
                <label htmlFor="pickup">Самовывоз</label>
                <input
                  type="radio"
                  id="pickup"
                  name="delMethod"
                  value="pickup"
                  checked={values.pickup}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.input_radio}>
                <label htmlFor="courier">Перевозчиком</label>
                <input
                  type="radio"
                  id="courier"
                  name="delMethod"
                  value="courier"
                  checked={!values.pickup}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          {!values.pickup ? (
            <>
              <div className={styles.input}>
                <label htmlFor="city">Населенный пункт</label>
                <input
                  type="text"
                  name="city"
                  maxLength="20"
                  value={values.city}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.input}>
                <label htmlFor="carrier">Перевозчик</label>
                <input
                  type="text"
                  name="carrier"
                  maxLength="20"
                  value={values.carrier}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.input}>
                <label htmlFor="branch">Отделение</label>
                <input
                  type="text"
                  name="branch"
                  maxLength="20"
                  value={values.branch}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.input}>
                <p> Форма оплаты</p>
                <div className={styles.input_radio_wrapper}>
                  <div className={styles.input_radio}>
                    <label htmlFor="prepaid">Предоплата</label>
                    <input
                      type="radio"
                      id="prepaid"
                      name="payment"
                      value="prepaid"
                      checked={values.prepaid}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.input_radio}>
                    <label htmlFor="postpaid">Наложенный платеж</label>
                    <input
                      type="radio"
                      id="postpaid"
                      name="payment"
                      value="postpaid"
                      checked={!values.prepaid}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
      {/* test */}
    </Layout>
  )
}
