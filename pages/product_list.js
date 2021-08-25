import Layout from '@/components/Layout'
import Link from 'next/link'
import ProductList from '@/components/ProductList'
import { useContext } from 'react'
import ProductsContext from '@/context/ProductsContext'

export default function ProductListPage() {  
  const { productList }=useContext(ProductsContext)
  return (
    <Layout title='Список товаров'>
      <Link href='/'>Вернуться на главную</Link>
      <ProductList products={productList}/>
    </Layout>
  )
}
