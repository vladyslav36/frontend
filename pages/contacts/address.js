import styles from '@/styles/Information.module.scss'
import Layout from "@/components/Layout";
import Links from "@/components/Links";
import { API_URL } from "@/config/index.js";

export default function AddressPage({ information }) {
  
  return (
    <Layout title="Адрес и режим работы магазина Кармен">
      <Links home={true} back={true} />
      <div className={styles.container}>
        <h1>Адрес магазина</h1>  
      <pre>{information.address}</pre>
      <h1>Режим работы</h1>
     <pre>{information.workingHours}</pre>
      </div>
      
    </Layout>
  )
}

export async function getServerSideProps() {
  const res = await fetch(`${API_URL}/api/information`)
  const { information } = (await res.json()) || {}

  if (!res.ok) {
    return {
      notFound: true,
    }
  }
  return {
    props: { information },
  }
}
