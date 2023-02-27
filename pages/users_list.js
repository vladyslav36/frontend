import AccessDenied from "@/components/AccessDenied"
import styles from "@/styles/UsersList.module.scss"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Layout from "@/components/Layout"
import AuthContext from "@/context/AuthContext"
import React, { useContext, useEffect, useState } from "react"
import Links from "@/components/Links"
import { API_URL } from "../config"

export default function usersList() {
  const { user } = useContext(AuthContext)
  const { isAdmin, token } = user

  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch(`${API_URL}/api/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error)
        return
      }
      setUsers(data.users)
    }
    if (Object.keys(user).length) {
      fetcher()
    }
  }, [user])

  
  return (
    <Layout title="список пользователей">
      <ToastContainer />
      {isAdmin ? (
        <>
          <div className={styles.links}>
            <Links home={true} back={true} />
          </div>
          <div className={styles.container}>
            <table>
              <thead>
                <tr>
                  <th rowSpan="2">Ник</th>
                  <th rowSpan="2">Телефон</th>
                  <th colSpan="5">Доставка</th>
                </tr>
                <tr>
                  <th>Имя</th>
                  <th>Фамилия</th>
                  <th>Телефон</th>
                  <th>Город</th>
                  <th>Перевозчик</th>
                </tr>
              </thead>
              <tbody>
                {users.length ? (
                  users.map((item, i) => (
                    <tr key={i}>
                      <td>{item.userName}</td>
                      <td>{item.phone}</td>
                      <td>{item.delivery.name}</td>
                      <td>{item.delivery.surname}</td>
                      <td>{item.delivery.phone}</td>
                      <td>{item.delivery.city}</td>
                      <td>
                        {item.delivery.carrier + " " + item.delivery.branch}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <AccessDenied />
      )}
    </Layout>
  )
}
