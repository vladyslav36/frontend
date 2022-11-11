import Layout from "@/components/Layout"
import styles from "@/styles/AccountForm.module.scss"
import { useState, useEffect, useContext } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import router from "next/router"
import { API_URL } from "@/config/index.js"
import Links from "@/components/Links"
import Navbar from "@/components/Navbar"
import AuthContext from "@/context/AuthContext"
import { GiCheckMark } from "react-icons/gi"

export default function UserProfile() {
  const { user, setUser } = useContext(AuthContext)
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [isChangePassword, setIsChangePassword] = useState(false)
  useEffect(() => {
    if (Object.keys(user).length) {
      setUserName(user.name)
      setUserEmail(user.email)
    }
  }, [user])

  const submitHandler = async (e) => {
    e.preventDefault()
    if (password !== passwordConfirm) {
      toast.error("Пароли не совпадают")
      return
    }
    const res = await fetch(`${API_URL}/api/user`, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${user.token}`,
      },
      method: "PUT",
      body: JSON.stringify({
        email: userEmail,
        password,
        name: userName,
        id: user._id,
      }),
    })
    const data = await res.json()
    if (!res.ok) {
      toast.error(data.message)
      return
    }
    setUser(data)
    router.push("/")
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
                 <i className="fa-solid fa-user"></i>{" "}             
              {user.isAdmin ? <pre>Admin</pre> : null}
            </h2>
            <div className={styles.input_wrapper}>
              <label htmlFor="userName">Имя</label>
              <input
                type="text"
                value={userName}
                id="username"
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className={styles.input_wrapper}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                value={userEmail}
                id="email"
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>
            <div className={styles.custom_checkbox}>
              <label htmlFor="isChange">Изменить пароль</label>
              <GiCheckMark
                className={
                  styles.icon + " " + (isChangePassword ? styles.visible : "")
                }
              />
              <input
                type="checkbox"
                value={isChangePassword}
                id="isChange"
                onChange={(e) => setIsChangePassword(e.target.checked)}
              />
            </div>
            {isChangePassword && (
              <>
                <div className={styles.input_wrapper}>
                  <label htmlFor="password">Пароль</label>
                  <input
                    type="password"
                    value={password}
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className={styles.input_wrapper}>
                  <label htmlFor="passwordConfirm">Подтвердить пароль</label>
                  <input
                    type="password"
                    value={passwordConfirm}
                    id="passwordConfirm"
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                  />
                </div>
              </>
            )}

            <input type="submit" className="btn" value="Сохранить" />
          </form>
        </div>
      ) : null}
    </Layout>
  )
}
