import Layout from "@/components/Layout"
import Link from "next/link"
import styles from "@/styles/OrderPage.module.css"
import { API_URL } from "@/config/index"
import moment from "moment"
import { useContext, useEffect, useState } from "react"
import AuthContext from "@/context/AuthContext"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Links from "@/components/Links"
import { useRouter } from "next/router"
import { getCurrencySymbol } from "utils"

export default function orderPage() {
  const { user } = useContext(AuthContext)
  const router = useRouter()
  const { id } = router.query  
  const [order, setOrder] = useState({})
  const [isOptions, setIsOptions] = useState(false)
  
  useEffect(() => {
    const fetchOrderById = async (id) => {
      const res = await fetch(`${API_URL}/api/order/${id}`, {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      })
      const { order } = await res.json()

      setOrder(order)
      setIsOptions("options" in order.orderItems[0])
    }
    if (Object.keys(user).length) {
      fetchOrderById(id)
    } else {
      router.push("/404")
    }
  }, [user])
  moment.locale("ru")

  return (
    <Layout title="Страница заказа">
      <ToastContainer />
      <div className={styles.container}>
        <Links home={true} back={true} />
        {Object.keys(order).length ? (
          <div className={styles.container}>
            <h4>
              Заказ № {order.count} от{" "}
              {moment(Date.parse(order.createdAt)).format("L")}
            </h4>
            <div className={styles.header}>
              <div>
                <p>
                  Имя: <span>{order.delivery.name}</span>
                </p>
                <p>
                  Фамилия: <span>{order.delivery.surname}</span>
                </p>
                <p>
                  Телефон: <span>{order.delivery.phone}</span>
                </p>
              </div>
              <div>
                <p>
                  Город: <span>{order.delivery.city}</span>
                </p>
                <p>
                  Способ доставки:{" "}
                  <span>
                    {order.delivery.pickup
                      ? "самовывоз"
                      : `перевозчик ${order.delivery.carrier} ${order.delivery.branch}`}
                  </span>
                </p>
                <p>
                  Способ оплаты:{" "}
                  <span>
                    {order.delivery.prepaid
                      ? "предоплата"
                      : "наложенным платежом"}
                  </span>
                </p>
              </div>
            </div>
            {order.orderItems.length ? (
              <div className={styles.table}>
                <table>
                  <thead>
                    <tr>
                      <td>Модель</td>
                      {isOptions
                        ? Object.keys(order.orderItems[0].options).map(
                            (option, i) => <td key={i}>{option}</td>
                          )
                        : null}
                      <td>Цена</td>
                      <td>Кол-во</td>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderItems.map((item, i) => (
                      <tr key={i}>
                        <td>{item.name}</td>
                        {isOptions && Object.keys(item.options).length
                          ? Object.keys(item.options).map((opt, j) => (
                              <td key={j}>{item.options[opt]}</td>
                            ))
                          : null}
                        <td>
                          {item.price} {getCurrencySymbol(item.currencyValue)}
                        </td>
                        <td>{item.qnt}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td
                        colSpan={
                          (isOptions
                            ? Object.keys(order.orderItems[0].options).length
                            : 0) + 3
                        }
                      >
                        <div>
                          <p>Всего товаров: {order.totalQnt}</p>
                          <p>Всего:{order.totalAmount}</p>
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </Layout>
  )
}


