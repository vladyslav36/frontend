import Layout from "@/components/Layout"
import styles from "@/styles/AccountForm.module.scss"
import { useState, useEffect, useContext } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useRouter } from "next/router"
import { API_URL } from "@/config/index.js"
import Links from "@/components/Links"
import Navbar from "@/components/Navbar"
import AuthContext from "@/context/AuthContext"
import AccessDenied from "@/components/AccessDenied"
import { formatingPhone } from "utils"
import { FaUser } from "react-icons/fa"

export default function userProfile() {
  const router = useRouter()
  const { user, setUser } = useContext(AuthContext)
  const [userPhone, setUserPhone] = useState("")
  const [delivery, setDelivery] = useState({
    name: "",
    surname: "",
    phone: "",
    city: "",
    carrier: "",
    branch: "",
  })

  useEffect(() => {
    if (Object.keys(user).length) {
      setUserPhone(user.phone)
      const { name, surname, phone, carrier, branch, city } = user.delivery

      setDelivery({ ...delivery, name, surname, phone, carrier, branch, city })
    }
  }, [user])


  const submitHandler = async (e) => {
    e.preventDefault()

    const res = await fetch(`${API_URL}/api/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ delivery, userPhone }),
    })
    const newUser = await res.json()

    if (!res.ok) {
      toast.error(newUser.message)
      return
    }
    setUser(newUser)
    router.back()
  }
  const handleDelivery = (e) => {
    e.preventDefault()
    const { name, value } = e.target

    setDelivery({ ...delivery, [name]: value })
  }

  return (
    <Layout title="User profile">
      <Navbar />
      <Links home={true} back={true} />
      {Object.keys(user).length ? (
        <div className={styles.container}>
          <ToastContainer />
          <form className={styles.form} onSubmit={submitHandler}>
            <h2>
              <p>
                <FaUser />
                <span>{user.userName}</span>
              </p>

              {user.isAdmin ? <pre>Admin</pre> : null}
            </h2>
            <p>
              <span>Метод автормзации {user.authMethod}</span>
            </p>

            <div className={styles.input_wrapper}>
              <label htmlFor="userPhone">Телефон</label>
              <input
                type="text"
                value={userPhone}
                maxLength="15"
                id="userPhone"
                name="userPhone"
                onChange={(e) => {                  
                  setUserPhone(formatingPhone(e.target.value))
                }}
              />
            </div>

            <p>
              <span>Доставка:</span>
            </p>
            <div className={styles.input_wrapper}>
              <label htmlFor="name">Имя</label>
              <input
                type="text"
                value={delivery.name}
                maxLength="20"
                id="name"
                name="name"
                onChange={handleDelivery}
              />
            </div>
            <div className={styles.input_wrapper}>
              <label htmlFor="surname">Фамилия</label>
              <input
                type="text"
                value={delivery.surname}
                maxLength="20"
                id="surname"
                name="surname"
                onChange={handleDelivery}
              />
            </div>
            <div className={styles.input_wrapper}>
              <label htmlFor="phone">Телефон</label>
              <input                
                type="text"
                value={delivery.phone}
                maxLength="15"
                id="phone"
                name="phone"
                onChange={(e)=>setDelivery({ ...delivery, 'phone': formatingPhone(e.target.value) })}
              />
            </div>
            <div className={styles.input_wrapper}>
              <label htmlFor="city">Город</label>
              <input
                type="text"
                value={delivery.city}
                maxLength="20"
                id="city"
                name="city"
                onChange={handleDelivery}
              />
            </div>
            <div className={styles.input_wrapper}>
              <label htmlFor="carrier">Перевозчик</label>
              <input
                type="text"
                value={delivery.carrier}
                maxLength="20"
                id="carrier"
                name="carrier"
                onChange={handleDelivery}
              />
            </div>
            <div className={styles.input_wrapper}>
              <label htmlFor="branch">Отделение</label>
              <input
                type="text"
                value={delivery.branch}
                maxLength="3"
                id="branch"
                name="branch"
                onChange={handleDelivery}
              />
            </div>

            <input type="submit" className="btn" value="Сохранить" />
          </form>
        </div>
      ) : (
        <AccessDenied />
      )}
    </Layout>
  )
}
