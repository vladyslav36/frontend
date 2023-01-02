import styles from "@/styles/AccountForm.module.scss"
import { useContext, useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { API_URL } from "@/config/index.js"
import AuthContext from "@/context/AuthContext"

export default function Login({ close, setLogRegMode }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { setUser } = useContext(AuthContext)

  
  const submitHandler = async (e) => {
    e.preventDefault()
    const res = await fetch(`${API_URL}/api/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
    const user = await res.json()
    if (!res.ok) {
      toast.error(user.message)
      return
    }
    setUser(user)
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

        <input type="submit" className="btn" value="Войти" />
        <div className={styles.bottom}>
          <p>Не зарегистрированы?</p>
          <p onClick={() => setLogRegMode(false)}>Регистрация</p> 
        </div>
        
      </form>
    </div>
  )
}
