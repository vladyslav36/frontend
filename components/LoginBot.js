import styles from "@/styles/LoginBot.module.scss"
import { v4 as uuid } from "uuid"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { io } from "socket.io-client"

import React, { useContext, useEffect, useState } from "react"
import { API_URL, TELEGRAM_BOT_URI, VIBER_BOT_URI } from "../config"
import Link from "next/link"
import AuthContext from "@/context/AuthContext"

export default function LoginBot({ elemDialog }) {
  const [authKey, setAuthKey] = useState("")
  const [authMethod, setAuthMethod] = useState("")
  const { setUser, user } = useContext(AuthContext)
  const [arg, setArg] = useState()
  

  useEffect(() => {
    const socket = io(API_URL, { transports: ["websocket"] })
    socket.on("authkey", (arg) => {       
    setArg(arg)   
  })
      return () => {
        socket.disconnect()
      }
  },[])
  useEffect(() => {
    setAuthKey(uuid().replace(/-/gi, ""))
  },[user])

  

  useEffect(() => {
    const login = async () => {
    const res = await fetch(`${API_URL}/api/user/login`, {
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
    // если то что пришло с сервера через socketio совпадает с ключем который отправил браузер по deepLink
    // тогда делаем логин и получаем обратно user с токеном
     if (arg === authKey) {
      login()
    }
  }, [arg])
  
  
  

  
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
          href={`viber://pa?chatURI=${VIBER_BOT_URI}&context=${authKey}`}
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
          href={`https://t.me/${TELEGRAM_BOT_URI}?start=${authKey}`}
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

      <div className={styles.warn}>
        <p>Для авторизации необходимо наличие аккаунта в Viber или Telegram</p>
      </div>
    </div>
  )
}
