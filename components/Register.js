import styles from "@/styles/AccountForm.module.css"
import { useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { API_URL } from "@/config/index.js"

export default function Register({ close, setLogRegMode }) {
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
    close()
  }
  return (
    <div className={styles.container}>
      <ToastContainer />
      <form className={styles.form} onSubmit={submitHandler}>
        <div className={styles.header_icons}>
          <i className="fa-solid fa-user fa-lg"></i>
          <i className="fa-solid fa-xmark fa-xl" onClick={() => close()}></i>
        </div>
        <div className={styles.input_wrapper}>
          <label htmlFor="userName">Имя</label>
          <input
            placeholder="Имя. Максимум 12 символов"
            type="text"
            value={userName}
            id="username"
            maxLength={12}
            onChange={(e) => setUserName(e.target.value.trimLeft())}
          />
        </div>
        <div className={styles.input_wrapper}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            value={email}
            id="email"
            maxLength={20}
            onChange={(e) => setEmail(e.target.value.trimLeft())}
          />
        </div>
        <div className={styles.input_wrapper}>
          <label htmlFor="password">Пароль</label>
          <input
            placeholder="Пароль.Максимум 10символов"
            type="password"
            value={password}
            id="password"
            maxLength={10}
            onChange={(e) => setPassword(e.target.value.trimLeft())}
          />
        </div>
        <div className={styles.input_wrapper}>
          <label htmlFor="passwordConfirm">Подтвердить пароль</label>
          <input
            placeholder="Пароль.Максимум 10символов"
            type="password"
            value={passwordConfirm}
            id="passwordConfirm"
            maxLength={10}
            onChange={(e) => setPasswordConfirm(e.target.value.trimLeft())}
          />
        </div>
        <input type="submit" className="btn" value="Зарегистрироваться" />
        <div className={styles.bottom}>
          <p>Уже зарегистрированы?</p>
          <a onClick={() => setLogRegMode(true)}>Войти</a>
        </div>
      </form>
    </div>
  )
}
