import Layout from "@/components/Layout"
import Link from "next/link"
import styles from "@/styles/OrderUserList.module.css"
import { API_URL } from "@/config/index"
import moment from "moment"
import {  useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Links from "@/components/Links"
import { FaEye, FaTimes } from "react-icons/fa"
import { useRouter } from "next/router"

export default function OrderUserList({orders}) {
  
  const router = useRouter()
  
  moment.locale("ru")
 
  const openOrder = (order) => {
    router.push(`/order_page/${order._id}`)
  }
  
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

export async function getServerSideProps({ params: { userId } }) {
   const res = await fetch(`${API_URL}/api/order/user/${userId}`)
   const { orders } = await res.json()
  return {
    props: {
      orders
    }
  }
}
