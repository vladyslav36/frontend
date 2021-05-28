import Layout from "@/components/Layout"
import { API_URL } from "@/config/index"
import CategoryItem from "@/components/CategoryItem"
import ProductList from '@/components/ProductList'
import styles from '@/styles/Category.module.css'

export default function categoryPage({ categories, params }) {
  const { slug } = params  
  const itemHref = slug ? `/category/${slug.join("/")}` : "/category"  
  const lastSlug = slug && slug[slug.length - 1]
  
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
  return (
    <Layout title="Категории">
      <div className={styles.container}>        
        {slug ? categoriesList.length? (          
          categoriesList
          .map(item=>(
        <CategoryItem item={item} key={item._id} itemHref={itemHref}/>
          ))
        ) : <ProductList categorySlug={lastSlug}/> : (
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
