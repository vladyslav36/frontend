import styles from "@/styles/Category.module.scss"
import Layout from "@/components/Layout"
import { API_URL, NOIMAGE } from "@/config/index"
import Link from "next/link"
import ProductsList from "@/components/ProductsList"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { getArrayCatTree } from "utils"
import Navbar from "@/components/Navbar"
import CategoriesList from "@/components/CategoriesList"
import Links from "@/components/Links"
import { FaBorderAll, FaFileExcel, FaFilePdf, FaList } from "react-icons/fa"

export default function categoryPage({ category, categories }) {
  const [productList, setProductList] = useState([])
  const [isShowAsList, setIsShowAsList] = useState(true)

  
  const childrenList = category
    ? categories
        .filter((item) => item.parentId === category._id)
        .sort((a, b) => (a.name > b.name ? 1 : -1))
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
        setProductList(products.sort((a, b) => (a.name > b.name ? 1 : -1)))
      }

      fetchProduct()
    }
  }, [category])

  return (
    <Layout
      title={`Категория ${Object.keys(category).length ? category.name : ""}`}
      description={Object.keys(category).length ? category.description : ""}
    >
      <Navbar />
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
              <FaList />
            </div>
            <div title="Плитка" onClick={() => setIsShowAsList(false)}>
              <FaBorderAll />
            </div>
          </div>
        ) : null}
      </div>

      <div className={styles.container}>
        <div>
          <div className={styles.left_content_header}>
            <div className={styles.image}>
              <img
                src={
                  category.image ? `${API_URL}${category.image}` : `${NOIMAGE}`
                }
              />
            </div>
           
          </div>
          {category.price || category.catalog ? (
            <div className={styles.left_content_footer}>
              {category.price ? (
                <Link href={`${API_URL}${category.price}`} target="_blank">
                  <div>
                    <p className={styles.icon_price}>
                      <FaFileExcel />
                    </p>
                    <p>Прайс</p>
                  </div>
                </Link>
              ) : null}
              {category.catalog ? (
                <Link href={`${API_URL}${category.catalog}`} target="_blank">
                  <div>
                    <p className={styles.icon_catalog}>
                      <FaFilePdf />
                    </p>
                    <p>Каталог</p>
                  </div>
                </Link>
              ) : null}
            </div>
          ) : null}
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
