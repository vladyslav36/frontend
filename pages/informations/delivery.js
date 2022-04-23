import Layout from "@/components/Layout";
import Links from "@/components/Links";
import { API_URL } from "@/config/index.js";
import styles from "@/styles/Information.module.css"

export default function DeliveryPage({information}) {
  return (
    <Layout title='Доставка заказов' description='Способы доставки заказов покупателям магазина Кармен'>
      <Links home={true} back={true} />
      <div className={styles.container}>
         <h1>Доставка заказов</h1> 
      <pre>{information.delivery}</pre>
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
