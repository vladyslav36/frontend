import Layout from "@/components/Layout";
import Links from "@/components/Links";
import { API_URL } from "@/config/index.js";
import styles from "@/styles/Information.module.css"

export default function ConditionsPage({information}) {
  return (
    <Layout title='Условия сотрудничества' description='Условия сотрудничечтва с магазином Кармен'>
      <Links home={true} back={true} />
      <div className={styles.container}>
        <h1>Условия сотрудничества</h1> 
      <div>{ information.conditions}</div>
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