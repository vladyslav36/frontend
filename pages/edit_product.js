import AccessDenied from "@/components/AccessDenied"
import EditProductList from "@/components/EditProductList"
import EditProduct from "@/components/EditProduct"
import Layout from "@/components/Layout"
import AuthContext from "@/context/AuthContext"
import { useState, useContext } from "react"
import { API_URL } from "../config"

export default function editProductPage({ categories, catalogs }) {
  const {
    user: { isAdmin, token },
  } = useContext(AuthContext)
  const [isShowProduct, setIsShowProduct] = useState(false)

  const [prodList, setProdList] = useState([])
  const [product, setProduct] = useState({})

  return (
    <Layout
      title={`Редактирование ${
        Object.keys(product).length ? product.name : ""
      }`}
    >
      {!isAdmin ? (
        <AccessDenied />
      ) : !isShowProduct ? (
        <EditProductList
          prodList={prodList}
          setProdList={setProdList}
          setIsShowProduct={setIsShowProduct}
          setProduct={setProduct}
          token={token}
          categories={categories}
          catalogs={catalogs}
        />
      ) : (
        <EditProduct
          setProdList={setProdList}
          prodList={prodList}
          categories={categories}
          catalogs={catalogs}
          product={product}
          setIsShowProduct={setIsShowProduct}
          token={token}
        />
      )}
    </Layout>
  )
}

export async function getServerSideProps() {
  const res1 = await fetch(`${API_URL}/api/categories`)
  const res2 = await fetch(`${API_URL}/api/catalogs`)
  const [{ categories }, { catalogs }] = await Promise.all([
    res1.json(),
    res2.json(),
  ])

  if (!res1.ok || !categories || !res2.ok || !catalogs) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      categories,
      catalogs,
    },
  }
}
