import Layout from "@/components/Layout"
import styles from "@/styles/AccountForm.module.css"
import { useState } from "react"
import { FaUser } from "react-icons/fa"
import Link from "next/link"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import router from "next/router"
import { API_URL } from "@/config/index.js"

export default function RegisterPage() {
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")

  const submitHandler = async (e) => {
    e.preventDefault()
    if (password !== passwordConfirm) {
      toast.error("Пароли не совпадают")
      return
    }
    const res = await fetch(`${API_URL}/api/user`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ email, password, name: userName }),
    })
    const data = await res.json()
    if (!res.ok) {
      toast.error(data.message)
      return
    }
    router.push("/")
  }
  return (
    <Layout title="User Register">
      <div className={styles.container}>
        <ToastContainer />
        <form className={styles.form} onSubmit={submitHandler}>
          <h2>
            <FaUser />
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
              value={email}
              id="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
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
          <input type="submit" className="btn" value="Зарегистрироваться" />
          <div className={styles.bottom}>
            <p>Уже зарегистрированы?</p>
            <Link href="/account/login">Войти</Link>
          </div>
        </form>
      </div>
    </Layout>
  )
}
