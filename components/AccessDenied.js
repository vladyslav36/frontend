import styles from '@/styles/AccessDenied.module.scss'
import Link from "next/link"
import { FaMinusCircle } from 'react-icons/fa'

export default function AccessDenied() {
  return (
    <div className={styles.denied}>
      <div className={styles.icon}>
        <FaMinusCircle />
      </div>
      <h1>У вас нет прав для просмотра этой страницы</h1>
      <Link href="/">Вернуться на главную</Link>
    </div>
  )
}
