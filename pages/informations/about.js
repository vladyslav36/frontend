import styles from "@/styles/Information.module.scss"
import Layout from '@/components/Layout'
import Links from '@/components/Links'
import { API_URL } from '@/config/index.js'


export default function AboutPage({information}) {
  return (
    <Layout title='О нас' description='Информация о магазине Кармен'>
      <div className={styles.container}>
      <Links home={true} back={true} />
        <h2>О нас</h2>
      <div>{information.aboutUs }</div>
      </div>
      
    </Layout>
  )
}

export async function getServerSideProps() {
  const res = await fetch(`${API_URL}/api/information`)
  const { information } = (await res.json()) || {}
  
  if (!res.ok) {
    return {
      notFound:true
    }    
  }
  return {
    props: {information},
  }
}