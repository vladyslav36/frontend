import styles from '@/styles/Category.module.css'
import Layout from "@/components/Layout"
import { API_URL } from "@/config/index"
import CategoryItem from "@/components/CategoryItem"
import ProductList from '@/components/ProductList'
import Link from 'next/link'
import { fetchProductsCategoryId } from 'dataFetchers'
import Spinner from '@/components/Spinner'


export default function categoryPage({ categories, params }) {
  const { slug } = params  
  const itemHref = slug ? `/category/${slug.join("/")}` : "/category"  
  const lastSlug = slug && slug[slug.length - 1]
  const lastCategoryId=categories.find(item=>item.slug===lastSlug)._id
  
  
  // Список категорий, которые являются детьми от категории lastSlug
const categoriesList =
  slug &&
  categories.filter(
    (item) =>
      item.parentCategoryId ===
      categories.find((item) => item.slug === lastSlug)._id
    )
  // Если slug не undefined пееходим на компоненты CategoryItem куда передаются url=itemHref
  // и которые являются детьми категории lastSlug
  // Если categoryList пустой массив, т.е. подкатегорий нет то переходим на компонент
  // ProductList куда передаем lastSlug как ссылку на категорию, продукты которой надо показать

  const getProductList = (categoryId) => {
    const { data,isLoading } = fetchProductsCategoryId(categoryId)
    if (isLoading) return <Spinner />
    
    const { products } = data
    
    return <ProductList products={products} />
  }
  return (
    <Layout title="Категории">
       <Link href='/'>На главную</Link> 
      <div className={styles.container}>
      
        {slug ? categoriesList.length? (          
          categoriesList
          .map(item=>(
        <CategoryItem item={item} key={item._id} itemHref={itemHref}/>
          ))
        ) : (
            getProductList(lastCategoryId)
        )
          
          
          : (
          categories
            .filter((item) => item.level === 0)
            .map((item) => (
              <CategoryItem item={item} key={item._id} itemHref={itemHref} />
            ))
        )}
      </div>
    </Layout>
  )
}

export async function getServerSideProps({ params }) {
  const data = await fetch(`${API_URL}/api/categories`)
  const { categories } = await data.json()
  return {
    props: {
      categories,
      params,
    },
  }
}
