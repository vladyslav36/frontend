import Layout from '@/components/Layout'
import styles from '@/styles/404.module.scss'
import Link from 'next/link'
import { FaExclamationTriangle } from 'react-icons/fa'
export default function NotFoundPage() {
  return (
    <Layout title="Страница не найдена">
      <div className={styles.error}>        
          <FaExclamationTriangle />        
        <h4>Извините, но здесь ничего нет</h4>
        <Link href="/">Вернуться на главную</Link>
      </div>
    </Layout>
  )
}
