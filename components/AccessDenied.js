import styles from '@/styles/AccessDenied.module.scss'
import { FaMinusCircle } from "react-icons/fa"
import Link from "next/link"

export default function AccessDenied() {
  return (
    <div className={styles.denied}>
      <FaMinusCircle className={styles.icon}/>
      <h1>У вас нет прав для просмотра этой страницы</h1>
      <Link href='/'>Вернуться на главную</Link>
    </div>
  )
}
