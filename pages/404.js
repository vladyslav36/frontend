import Layout from '@/components/Layout'
import styles from '@/styles/404.module.css'
import { FaExclamationTriangle } from 'react-icons/fa'
import Link from 'next/link'
export default function NotFoundPage() {
  return (
    <Layout title='Страница не найдена'>
      <div className={styles.error}>
        <h1><FaExclamationTriangle/>404</h1>
        <h4>Извините, но здесь ничего нет</h4>
        <Link href='/'>Вернуться на главную</Link>
      </div>
    </Layout>
  )
}
