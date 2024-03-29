import styles from "@/styles/Category.module.scss"
import Layout from "@/components/Layout"
import { API_URL, NOIMAGE } from "@/config/index"
import Link from "next/link"
import ProductsList from "@/components/ProductsList"
import { useEffect, useState } from "react"
import { getArrayCatTree } from "utils"
import Navbar from "@/components/Navbar"
import Links from "@/components/Links"
import CatalogsList from "@/components/CatalogsList"
import { FaBorderAll, FaList } from "react-icons/fa"


export default function catalogPage({ catalog, catalogs }) {
  const [productList, setProductList] = useState([])
  const [isShowAsList, setIsShowAsList] = useState(true)
  
  
  const childrenList = catalog
    ? catalogs.filter((item) => item.parentId === catalog._id)
    : []

  // ld+json for SEO
  const schemaData = {
    "@context": "http://www.schema.org",
    "@type": "catalog",
    name: catalog.name,
    image: catalog.image,
    description: catalog.description,
  }

  useEffect(() => {
    if (childrenList.length) {
      setProductList([])
    } else {
      const fetchProduct = async () => {
        const res = await fetch(
          `${API_URL}/api/products/catalog/${catalog._id}`
        )
        const { products } = await res.json()
        setProductList(products)
      }

      fetchProduct()
    }
  }, [catalog])

  return (
    <Layout
      title={`Каталог ${Object.keys(catalog).length ? catalog.name : ""}`}
      description={Object.keys(catalog).length ? catalog.description : ""}
    >
      <Navbar catalogs={catalogs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <div className={styles.header}>
        <div className={styles.header_left}>
          <Links home={true} back={true} />
          <div className={styles.crumbs}>
            {getArrayCatTree(catalog, catalogs).map((item, i, arr) => {
              const arrow = i < arr.length - 1 ? <div>&nbsp;➔&nbsp;</div> : null
              return (
                <div key={i}>
                  <Link href={`/catalog/${item._id}`}>
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
        <div className={styles.left_content_header}>
          <div className={styles.image}>
            <img
              src={catalog.image ? `${API_URL}${catalog.image}` : `${NOIMAGE}`}              
            />
          </div>
         
        </div>
        <div className={styles.right_content}>
          {childrenList.length ? (
            <CatalogsList catalogs={childrenList} />
          ) : productList.length ? (
            <ProductsList products={productList} isShowAsList={isShowAsList} />
          ) : null}
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps({ params: { id } }) {
  const res = await fetch(`${API_URL}/api/catalogs`)
  const { catalogs } = await res.json()
  const res2 = await fetch(`${API_URL}/api/catalogs/${id}`)
  const { catalog } = await res2.json()
  if (!res.ok || !res2.ok) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      catalog,
      catalogs,
    },
  }
}
