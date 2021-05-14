import Layout from "@/components/Layout"
import { API_URL } from '@/config/index.js'
import Showcase from '@/components/Showcase'


export default function HomePage({ showcaseProducts }) {
  
  return (
    <Layout title='Кармен' description='Оптовый магазин Кармен' keywords='Колготки, носки, лосины, леггинсы опт, розница'>
      <Showcase showcaseProducts={showcaseProducts}/>      
    </Layout> 
  )
}

export async function getServerSideProps(){
  const res = await fetch(`${API_URL}/api/showcase`)
  const showcaseProducts = await res.json()
  
  return {
    props:{
      showcaseProducts
      
    }
  }

}
