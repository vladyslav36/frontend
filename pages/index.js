import Layout from "@/components/Layout"
import Showcase from "@/components/Showcase"
import Navbar from "@/components/Navbar"
import AdminPanel from "@/components/AdminPanel"
import { API_URL } from "../config/index.js"

export default function HomePage({ showcaseProducts }) {
  return (
    <Layout
      title="Кармен"
      description="Оптовый магазин Кармен"
      keywords="Колготки, носки, лосины, леггинсы опт, розница"
    >
      <Navbar />
      
      <AdminPanel />
      <Showcase showcaseProducts={showcaseProducts} />
    </Layout>
  )
}

export async function getServerSideProps() {
  const res = await fetch(`${API_URL}/api/products/showcase`)
  const { showcaseProducts } = await res.json()
  if (!res.ok) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      showcaseProducts,
    },
  }
}
