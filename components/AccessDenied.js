import styles from '@/styles/AccessDenied.module.scss'
import Link from "next/link"

export default function AccessDenied() {
  return (
    <div className={styles.denied}>
      <div className={styles.icon}>
        <i className="fa-solid fa-circle-minus"></i>
      </div>
      <h1>У вас нет прав для просмотра этой страницы</h1>
      <Link href="/">Вернуться на главную</Link>
    </div>    
  )
}
