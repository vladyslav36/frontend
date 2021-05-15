import Layout from "@/components/Layout"
import { API_URL } from "@/config/index.js"
import Showcase from "@/components/Showcase"
import AuthContext from "@/context/AuthContext"
import { useContext } from "react"

export default function HomePage({ showcaseProducts, currencyRate }) {
  const { setCurrencyRate } = useContext(AuthContext)
  setCurrencyRate(currencyRate)
  return (
    <Layout
      title="Кармен"
      description="Оптовый магазин Кармен"
      keywords="Колготки, носки, лосины, леггинсы опт, розница"
    >
      <Showcase showcaseProducts={showcaseProducts} />
    </Layout>
  )
}

export async function getServerSideProps() {
  const res = await fetch(`${API_URL}/api/showcase`)
  const { showcaseProducts, currencyRate } = await res.json()

  return {
    props: {
      showcaseProducts,
      currencyRate,
    },
  }
}
