import styles from "@/styles/Login.module.scss"
import { v4 as uuid } from "uuid"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { io } from "socket.io-client"
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from "react"
import { API_URL, TELEGRAM_BOT_URI, VIBER_BOT_URI } from "../config"
import Link from "next/link"
import AuthContext from "@/context/AuthContext"
import Layout from "@/components/Layout"
import { FaTelegram, FaTimes, FaViber } from "react-icons/fa"

export default function loginPage() {
  const [authKey, setAuthKey] = useState("")
  const [authMethod, setAuthMethod] = useState("")
  const { setUser, user } = useContext(AuthContext)
  const [arg, setArg] = useState()

  const router=useRouter()
  useEffect(() => {
    const socket = io(API_URL, { transports: ["websocket"] })
    socket.on("authkey", (arg) => {
      setArg(arg)
    })
    return () => {
      socket.disconnect()
    }
  }, [])
  useEffect(() => {
    setAuthKey(uuid().replace(/-/gi, ""))
  }, [user])

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
      router.back()
    }
    // если то что пришло с сервера через socketio совпадает с ключем который отправил браузер по deepLink
    // тогда делаем логин и получаем обратно user с токеном
    if (arg === authKey) {
      login()
    }
  }, [arg])

  return (
    <Layout title="Страница авторизации">
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <ToastContainer />
          <div
            className={styles.cancell}
            onClick={() => router.back()}
            title="Закрыть"
          >
            <FaTimes />
          </div>
          <h1>Авторизация</h1>
          <div className={styles.icons}>
            <Link
              href={`viber://pa?chatURI=${VIBER_BOT_URI}&context=${authKey}`}
              target="_blank"
            >
             
               <FaViber title="Авторизация через Viber"
                onClick={() => setAuthMethod("Viber")} name='viber'/>
             
            </Link>
            <Link
              href={`https://t.me/${TELEGRAM_BOT_URI}?start=${authKey}`}
              target="_blank"
            >
             
                <FaTelegram title="Авторизация через Telegram"
                onClick={() => setAuthMethod("Telegram")} name='telegram'/>
              
            </Link>
          </div>

          <div className={styles.warn}>
            <p>
              Для авторизации необходимо наличие аккаунта в Viber или Telegram
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
