import styles from "@/styles/Information.module.scss"
import Layout from "@/components/Layout";
import Links from "@/components/Links";
import { API_URL } from "@/config/index.js";

export default function ProductReturnPage({ information }) {
  return (
    <Layout title="Возврат товара">
      <div className={styles.container}>
      <Links home={true} back={true} />
        <h1>Возврат товара</h1> 
      <p>{information.productReturn}</p>
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
