import Layout from "@/components/Layout";
import Links from "@/components/Links";
import { API_URL, UPOST_IMAGE,NEW_POST_IMAGE, AUTOLUX_IMAGE } from "@/config/index.js";
import styles from "@/styles/Information.module.css"

export default function DeliveryPage({information}) {
  return (
    <Layout
      title="Доставка заказов"
      description="Способы доставки заказов покупателям магазина Кармен"
    >
      <Links home={true} back={true} />
      <div className={styles.container}>
        <h1>Доставка заказов</h1>
        <div>
          {information.delivery}
</div>
        
       
          <div className={styles.logos}>
            <div className={styles.image}>
              <img title="Новая почта" src={NEW_POST_IMAGE} />
            </div>
            <div className={styles.image}>
              <img title="Автолюкс" src={AUTOLUX_IMAGE} />
            </div>
            <div className={styles.image}>
              <img title="Укрпочта" src={UPOST_IMAGE} />
            </div>
          </div>
        
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
