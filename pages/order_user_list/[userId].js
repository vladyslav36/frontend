import Layout from "@/components/Layout"
import Link from "next/link"
import styles from "@/styles/OrderUserList.module.css"
import { API_URL } from "@/config/index"
import moment from "moment"
import {  useEffect, useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Links from "@/components/Links"
import { FaEye, FaTimes } from "react-icons/fa"
import { useRouter } from "next/router"
import { useContext } from "react/cjs/react.development"
import AuthContext from "@/context/AuthContext"

export default function OrderUserList() {
  const { user } = useContext(AuthContext)
  const [orders, setOrders] = useState([])
  useEffect(() => {
    const fetchOrdersById = async () => {
      const res = await fetch(`${API_URL}/api/order/user/${user._id}`, {
        headers: {
          authorization:`Bearer ${user.token}`
        }
      })
      const { orders } = await res.json()
      setOrders(orders)
    }
    if (Object.keys(user).length) {
      fetchOrdersById()
    } else {
      router.push('/404')
    }
  },[user])
  const router = useRouter()
  
  moment.locale("ru")
 
  const openOrder = (order) => {
    router.push(`/order_page/${order._id}`)
  }
  console.log(user)
  return (
    <Layout title="Список заказов">
      <ToastContainer />
      <div className={styles.container}>
        <Links home={true} back={true} />
        <div className={styles.table}>
          <table>
            <thead>
              <tr>
                <th>№</th>
                <th>Дата</th>                
                <th>Общая сумма</th>
                <th>&nbsp;</th>                
              </tr>
            </thead>
            <tbody>
              {orders.length
                ? orders.map((item, i) => (
                    <tr key={i}>
                      <td>{item.count}</td>
                      <td>{moment(Date.parse(item.createdAt)).format("L")}</td>                      
                      <td>{item.totalAmount}</td>
                      <td title="Смотреть заказ">
                        <button onClick={() => openOrder(item)}>
                          <FaEye className={styles.icon} />
                        </button>
                      </td>
                      
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}


