import Layout from "@/components/Layout"
import Link from "next/link"
import styles from "@/styles/OrderPage.module.css"
import { API_URL } from "@/config/index"
import moment from "moment"
import { useContext, useEffect, useState } from "react"
import ProductsContext from "@/context/ProductsContext"
import AuthContext from "@/context/AuthContext"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Links from "@/components/Links"
import { FaEye, FaTimes } from "react-icons/fa"
import { useRouter } from "next/router"


export default function orderPage({ order }) {
  moment.locale('ru')
  console.log(order)
  return (
    <Layout title="Страница заказа">
      <ToastContainer />
      <div className={styles.container}>
        <Links home={true} back={true} />
        <div className={styles.container}>
          <h4>
            Заказ № {order.count} от{" "}
            {moment(Date.parse(order.createdAt)).format("L")}
          </h4>
          <div className={styles.header}>
            <h5>
              Имя: <span>{order.delivery.name}</span>
            </h5>
            <h5>
              Фамилия: <span>{order.delivery.surname}</span>
            </h5>
            <h5>
              Телефон: <span>{order.delivery.phone}</span>
            </h5>
            
            <h5>
              Город: <span>{order.delivery.city}</span>
            </h5>
            <h5>
              Способ доставки: <span>{order.delivery.pickup?'самовывоз':`перевозчик ${order.delivery.carrier} ${order.delivery.branch}`}</span>
            </h5>
            <h5>
              Способ оплаты: <span>{order.delivery.prepaid?'предоплата':'наложенным платежом'}</span>
            </h5>
          </div>
          <div className={styles.table}>
            <table>
              <thead></thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps({ params: { id } }) {
  const res = await fetch(`${API_URL}/api/order/${id}`)
  const data = await res.json()
  if (!res.ok || !data) {
    return {
      notFound:true
    }
  }
  return {
    props: {
      order:data.order
    }
  }
}
