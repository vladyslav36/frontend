import styles from "@/styles/Links.module.scss"
import { useRouter } from "next/router"
import { FaChevronCircleLeft, FaHouseDamage } from "react-icons/fa"


export default function Links({ home, back }) {
  const router = useRouter()
  return (
    <dir className={styles.links}>
      {back ? (       
         <FaChevronCircleLeft onClick={() => router.back()} title="Назад"/>       
      ) : null}
      {home ? (        
          <FaHouseDamage onClick={()=>router.push('/')} title="На главную"/>                   
      ) : null}
    </dir>
  )
}
