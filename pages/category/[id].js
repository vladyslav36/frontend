import styles from "@/styles/Category.module.scss"
import Layout from "@/components/Layout"
import { API_URL, NOIMAGE } from "@/config/index"
import Link from "next/link"
import ProductsList from "@/components/ProductsList"
import { useEffect, useState } from "react"
import { getArrayCatTree } from "utils"
import Navbar from "@/components/Navbar"
import CategoriesList from "@/components/CategoriesList"
import Links from "@/components/Links"

export default function categoryPage({ category, categories }) {
  const [productList, setProductList] = useState([])
  const [isShowAsList, setIsShowAsList] = useState(true)

  const childrenList = category
    ? categories.filter((item) => item.parentId === category._id)
    : []

  // ld+json for SEO
  const schemaData = {
    "@context": "http://www.schema.org",
    "@type": "category",
    name: category.name,
    image: category.image,
    description: category.description,
  }

  useEffect(() => {
    if (childrenList.length) {
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
    }
  }, [category])

  return (
    <Layout
      title={`Категория ${Object.keys(category).length ? category.name : ""}`}
      description={Object.keys(category).length ? category.description : ""}
    >
      <Navbar categories={categories} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <div className={styles.header}>
        <div className={styles.header_left}>
          <Links home={true} back={true} />
          <div className={styles.crumbs}>
            {getArrayCatTree(category, categories).map((item, i, arr) => {
              const arrow = i < arr.length - 1 ? <div>&nbsp;➔&nbsp;</div> : null
              return (
                <div key={i}>
                  <Link href={`/category/${item._id}`}>
                    <p>{item.name}</p>
                  </Link>
                  {arrow}
                </div>
              )
            })}
          </div>
        </div>
        {!childrenList.length ? (
          <div className={styles.toggles}>
            <div title="Список" onClick={() => setIsShowAsList(true)}>
              <i className="fa-solid fa-list"></i>
            </div>
            <div title="Плитка" onClick={() => setIsShowAsList(false)}>
              <i className="fa-solid fa-table-cells"></i>
            </div>
          </div>
        ) : null}
      </div>

      <div className={styles.container}>
        <div className={styles.left_content}>
          <div className={styles.image}>
            <img
              src={
                category.image ? `${API_URL}${category.image}` : `${NOIMAGE}`
              }
            />
          </div>
          <div className={styles.name}>
            <p>{category.name}</p>
          </div>
        </div>
        <div className={styles.right_content}>
          {childrenList.length ? (
            <CategoriesList categories={childrenList} />
          ) : productList.length ? (
            <ProductsList products={productList} isShowAsList={isShowAsList} />
          ) : null}
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps({ params: { id } }) {
  const res = await fetch(`${API_URL}/api/categories`)
  const { categories } = await res.json()
  const res2 = await fetch(`${API_URL}/api/categories/${id}`)
  const { category } = await res2.json()
  if (!res.ok || !res2.ok) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      categories,
      category,
    },
  }
}
