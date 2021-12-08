import Layout from "@/components/Layout"
import Link from "next/link"
import styles from "@/styles/OrderList.module.css"
import { API_URL } from "@/config/index"
import moment from 'moment'
import { useContext, useEffect, useState } from "react"
import ProductsContext from "@/context/ProductsContext"
import AuthContext from "@/context/AuthContext"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Links from "@/components/Links"
import { FaEye, FaTimes } from "react-icons/fa"
import {useRouter} from "next/router"

export default function OrderList() {
  const { user } = useContext(AuthContext)
  const router=useRouter()
  const [orders, setOrders] = useState([])
  moment.locale('ru')
  console.log(orders)
  useEffect(() => {
    const fetchAllOrders = async () => {
      const res = await fetch(`${API_URL}/api/order`)
      const { orders } = await res.json()
      
      setOrders(orders.reverse())
    }
    fetchAllOrders()
  }, [])
  const openOrder = (order) => {
    router.push(`/order_page/${order._id}`)
  }
  const deleteOrder = async ({ order, idx }) => {
    console.log(order._id)
    const res = await fetch(`${API_URL}/api/order/delete/${order._id}`)
    if (res.ok) {
       setOrders(orders.filter((item,i)=>i!==idx))
    } else {
      toast.error('Не удалось удалить заказ')
    }
   
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
                <th>Клиент</th>
                <th>Город</th>
                <th>Общая сумма</th>
                <th>&nbsp;</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {orders.length
                ? orders.map((item, i) => (
                    <tr key={i}>
                      <td>{item.count}</td>
                      <td>{moment(Date.parse(item.createdAt)).format("L")}</td>
                      <td>
                        {item.delivery.name ? item.delivery.name : null}&nbsp;
                        {item.delivery.surname ? item.delivery.surname : null}
                      </td>
                      <td>{item.delivery.city ? item.delivery.city : null}</td>
                      <td>{item.totalAmount}</td>
                      <td title="Смотреть заказ">
                      <button onClick={() => openOrder(item)}>
                        <FaEye className={styles.icon}/>
                      </button>
                     
                    </td>
                    <td title='Удалить заказ'>
                       <button onClick={()=>deleteOrder({order:item,idx:i})}>
                        <FaTimes className={styles.icon}/>
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
