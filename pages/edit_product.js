import AccessDenied from "@/components/AccessDenied"
import EditProductList from "@/components/EditProductList"
import EditProduct from "@/components/EditProduct"
import Layout from "@/components/Layout"
import AuthContext from "@/context/AuthContext"
import { useState, useContext } from "react"
import { API_URL } from "../config"

export default function editProductPage({ categories }) {
  const {
    user: { isAdmin, token },
  } = useContext(AuthContext)
  const [isShowProduct, setIsShowProduct] = useState(false)
  
  const [prodList, setProdList] = useState([])
  const [product, setProduct] = useState({})

  return (
    <Layout title="Редактирование продукта">
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
        />
      ) : (
        <EditProduct
          categories={categories}
          product={product}
          setIsShowProduct={setIsShowProduct}
          token={token}
        />
      )}
    </Layout>
  )
}

export async function getServerSideProps() {
  const res = await fetch(`${API_URL}/api/categories`)
  const { categories } = await res.json()

  if (!res.ok || !categories) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      categories,
    },
  }
}
