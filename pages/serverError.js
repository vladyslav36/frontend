import Layout from "@/components/Layout";
import styles from '@/styles/404.module.scss'
import Link from "next/link";


export default function serverErrorPage() {
  return (
    <Layout title="Server Error">
      <div className={styles.error}>
        <h1>
          <i className="fa-solid fa-triangle-exclamation"></i>
          404
        </h1>
        <h4>Ошибка при подключении к серверу</h4>
        <Link href="/">Вернуться на главную</Link>
      </div>
    </Layout>
  )
}
