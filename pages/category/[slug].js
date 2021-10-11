import styles from "@/styles/Category.module.css"
import Layout from "@/components/Layout"
import { API_URL } from "@/config/index"
import { useRouter } from "next/router"
import Link from "next/link"
import ProductsList from "@/components/ProductsList"
import { useEffect, useState } from "react"
import { getArrayCategoryTree, getQntProdInCat } from "utils"
import Navbar from "@/components/Navbar"
import CategoriesList from "@/components/CategoriesList"
import { FaList, FaTh } from "react-icons/fa"

import Links from "@/components/Links"
import useSWR from "swr"

export default function categoryPage({ categories, params: { slug } }) {
  const router = useRouter()

  const [isShowCategories, setIsShowCategories] = useState(false)
  const [isShowProducts, setIsShowProducts] = useState(false)
  const [productList, setProductList] = useState([])
  const [isShowAsList, setIsShowAsList] = useState(true)
  const category = categories.find((item) => item.slug === slug)

  const childrenList = categories.filter(
    (item) => item.parentCategoryId === category._id
  )
  const { data: dataProd } = useSWR(`${API_URL}/api/products`)

  const qnt =
    dataProd &&
    getQntProdInCat({
      products: dataProd.products,
      categories,
    })
  useEffect(async () => {
    if (childrenList.length) {
      setIsShowCategories(true)
      setIsShowProducts(false)
      setProductList([])
    } else {
      const fetchProduct = async () => {
        const res = await fetch(
          `${API_URL}/api/products/category/${category._id}`
        )
        const { products } = await res.json()
        setProductList(products)
      }
      fetchProduct()
      setIsShowCategories(false)
      setIsShowProducts(true)
    }
  }, [category])

  return (
    <Layout title="Категории">
      <Navbar />
      <div className={styles.header}>
        <div className={styles.header_left}>
          <Links home={true} back={true} />
          <div className={styles.crumbs}>
            {getArrayCategoryTree(category, categories).map((item, i, arr) => {
              const arrow = i < arr.length - 1 ? <div>&nbsp;➔&nbsp;</div> : null
              return (
                <div key={i}>
                  <Link href={`/category/${item.slug}`}>
                    <a>{item.name}</a>
                  </Link>
                  {arrow}
                </div>
              )
            })}
          </div>
        </div>
        {isShowProducts ? (
          <div className={styles.toggles}>
            <div title="Список" onClick={() => setIsShowAsList(true)}>
              <FaList />
            </div>
            <div title="Плитка" onClick={() => setIsShowAsList(false)}>
              <FaTh />
            </div>
          </div>
        ) : null}
      </div>

      <div className={styles.container}>
        <div className={styles.left_content}>
          <div className={styles.image}>
            <img
              src={
                category.image ? `${API_URL}${category.image}` : "/noimage.png"
              }
              alt="No image"
            />
          </div>
          <div className={styles.name}>
            <p>{category.name}</p>
          </div>
        </div>
        <div className={styles.right_content}>
          {isShowCategories ? (
            <CategoriesList categories={childrenList} qnt={qnt ? qnt : ""} />
          ) : null}
          {isShowProducts ? (
            productList.length ? (
              <ProductsList
                products={productList}
                isShowAsList={isShowAsList}
              />
            ) : (
              <h3>В этой категории нет товаров</h3>
            )
          ) : null}
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps({ params }) {
  const res = await fetch(`${API_URL}/api/categories`)
  const data = await res.json()

  if (!data) {
    return {
      notFound: true,
    }
  }
  const { categories } = data
  return {
    props: {
      categories,
      params,
    },
  }
}