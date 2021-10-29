import Layout from "@/components/Layout"
import styles from "@/styles/AccountForm.module.css"
import { useContext, useState } from "react"
import { FaUser } from "react-icons/fa"
import Link from "next/link"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { API_URL } from "@/config/index.js"
import AuthContext from "@/context/AuthContext"
import { useRouter } from 'next/router'

export default function LoginPage() {
  const router=useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const {setUser }=useContext(AuthContext)

  const submitHandler = async (e) => {
    e.preventDefault()
    const res = await fetch(`${API_URL}/api/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },      
      body:JSON.stringify({email,password})
    })
    const user=await res.json()
    if (!res.ok) {
      toast.error(user.message)
      return
    }
    setUser(user)
    router.push('/')
  }
  return (
    <Layout title='User login'>
      <div className={styles.container}>
        <ToastContainer/>
        <form className={styles.form} onSubmit={submitHandler}>
          <h3>
            <FaUser /> 
          </h3>
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
            <Link href="/account/register">Регистрация</Link>
          </div>
        </form>
      </div>
    </Layout>
  )
}
