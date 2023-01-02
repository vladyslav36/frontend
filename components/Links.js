import styles from "@/styles/Links.module.scss"
import { useRouter } from "next/router"


export default function Links({ home, back }) {
  const router = useRouter()
  return (
    <dir className={styles.links}>
      {back ? (
        <div onClick={() => router.back()} title="Назад">
          <i className="fa-solid fa-circle-chevron-left fa-xl"></i>
        </div>
      ) : null}
      {home ? (        
          <div onClick={()=>router.push('/')} title="На главную">
            <i className="fa-solid fa-house-chimney fa-xl"></i>
          </div>        
      ) : null}
    </dir>
  )
}
