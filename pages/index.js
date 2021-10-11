import Layout from "@/components/Layout"
import Showcase from "@/components/Showcase"
import Navbar from "@/components/Navbar"

import AdminPanel from "@/components/AdminPanel"



export default function HomePage() {  
  return (
    <Layout
      title="Кармен"
      description="Оптовый магазин Кармен"
      keywords="Колготки, носки, лосины, леггинсы опт, розница"     
    >
      <Navbar />
      <AdminPanel/>
      <Showcase />
    </Layout>
  )
}






