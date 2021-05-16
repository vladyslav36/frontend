import Layout from "@/components/Layout"
import { API_URL } from "@/config/index.js"
import Showcase from "@/components/Showcase"
import Navbar from "@/components/Navbar"
import Breadcrumb from "@/components/Breadcrumb"

import AuthContext from "@/context/AuthContext"
import { useContext } from "react"

export default function HomePage({ showcaseProducts,categories }) {  
  return (
    <Layout
      title="Кармен"
      description="Оптовый магазин Кармен"
      keywords="Колготки, носки, лосины, леггинсы опт, розница"
    >
      <Navbar categories={categories}/>
      <Breadcrumb/>
      <Showcase showcaseProducts={showcaseProducts} />
    </Layout>
  )
}

export async function getServerSideProps() {
  const resProducts = await fetch(`${API_URL}/api/products/showcase`)
  const { showcaseProducts } = await resProducts.json()
  const resCategories = await fetch(`${API_URL}/api/categories`)
  const { categories }=await resCategories.json()
  return {
    props: {
      showcaseProducts,
      categories
      
    },
  }
}
