import styles from "@/styles/LoginBot.module.scss"
import { v4 as uuid } from "uuid"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import React, { useContext, useEffect, useState } from "react"
import { API_URL, API_URL_BOT } from "../config"
import Link from "next/link"
import AuthContext from "@/context/AuthContext"

export default function LoginBot({ elemDialog }) {
  const [authKey, setAuthKey] = useState("")
  const [authMethod, setAuthMethod] = useState("")
  const { setUser, user } = useContext(AuthContext)

  useEffect(() => {
    setAuthKey(uuid().replace(/-/gi, ""))
  }, [])

  const login = async () => {
    const res = await fetch(`${API_URL_BOT}/api/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ authKey, authMethod }),
    })

    const user = await res.json()

    if (!res.ok) {
      toast.error(user.message)
      return
    }

    setUser(user)   
    elemDialog.current.close()
  }

  
  console.log(user)
  return (
    <div className={styles.container}>
      <ToastContainer />
      <div
        className={styles.cancell}
        onClick={() => elemDialog.current.close()}
        title="Закрыть"
      >
        <i className="fa-solid fa-xmark fa-xl"></i>
      </div>
      <h1>Авторизация</h1>
      <div className={styles.icons}>
        <Link
          href={`viber://pa?chatURI=karmenshop&context=${authKey}`}
          target="_blank"
        >
          <div
            title="Авторизация через Viber"
            onClick={() => setAuthMethod("Viber")}
            
          >
            <i className="fa-brands fa-viber fa-4x"></i>
          </div>
        </Link>
        <Link
          href={`https://t.me/karmenshop_bot?start=${authKey}`}
          target="_blank"
        >
          <div
            title="Авторизация через Telegram"
            onClick={() => setAuthMethod("Telegram")}
          >
            <i className="fa-brands fa-telegram fa-4x"></i>
          </div>
        </Link>
      </div>

      <div className={styles.btn} onClick={login}>
        <p>Войти</p>
      </div>
    </div>
  )
}
