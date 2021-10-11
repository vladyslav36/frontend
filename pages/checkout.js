import Layout from "@/components/Layout"
import Links from "@/components/Links"
import styles from "@/styles/Checkout.module.css"
import { useEffect, useState } from "react"

export default function Checkout() {
  const [values, setValues] = useState({
    name: "",
    surname: "",
    phone: "",
    city:'',
    carrier:'',
    branch:'',
    pickup: true,
    courier: false,
    prepaid: true,
    postpaid: false,
  })
  useEffect(() => {
    const data = localStorage.getItem("checkout")
    if (data) setValues(JSON.parse(data))
  }, [])
  const handleChange = (e) => {
    const { name, value, checked } = e.target
    if (name === "delMethod") {
      setValues({
        ...values,
        ["pickup"]: value === "pickup",
        ["courier"]: value === "courier",
      })
    } else {
      if (name === "payment") {
        setValues({
          ...values,
          ["prepaid"]: value === "prepaid",
          ["postpaid"]: value === "postpaid",
        })
      } else {
        e.preventDefault()
        setValues({ ...values, [name]: value })
      }
    }
  }

  const handleSendOrder = () => {
    localStorage.setItem("checkout", JSON.stringify(values))
    console.log("ok")
  }
  console.log(values)
  return (
    <Layout title="Оформление заказа">
      <div className={styles.container}>
        <div className={styles.header}>
          <Links home={true} back={true} />
          <button className={styles.button} onClick={handleSendOrder}>
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
              value={values.phone}
              onChange={handleChange}
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
                  checked={values.courier}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          {values.courier ? (
            <>
              <div className={styles.input}>
                <label htmlFor="city">Населенный пункт</label>
                <input type="text" name='city' value={values.city} onChange={handleChange} />
              </div>
              <div className={styles.input}>
                <label htmlFor="carrier">Перевозчик</label>
                <input
                  type="text"
                  name='carrier'
                  value={values.carrier}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.input}>
                <label htmlFor="branch">Отделение</label>
                <input
                  type="text"
                  name='branch'
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
                      checked={values.postpaid}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </Layout>
  )
}