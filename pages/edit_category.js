
import AccessDenied from "@/components/AccessDenied"
import Layout from "@/components/Layout"
import AuthContext from "@/context/AuthContext"
import { useContext, useState } from "react"
import { getCategoriesTree } from "utils"
import { API_URL } from "../config"
import EditCategory from '../components/EditCategory'
import EditCategoryList from '../components/EditCategoryList'





export default function editCategory({categories:dbCategories}) {
  const {
    user: { isAdmin, token },
  } = useContext(AuthContext)
  const [categories, setCategories] = useState(dbCategories)
  const [isShowCategory, setIsShowCategory] = useState(false)
  const [category, setCategory] = useState({})

  return (
    <Layout title="Редактирование категорий">
      {!isAdmin ? (
        <AccessDenied />
      ) : isShowCategory ? (
        <EditCategory
          category={category}
            categories={categories}
            setCategories={setCategories}
          setIsShowCategory={setIsShowCategory}
          token={token}
        />
      ) : (
        <EditCategoryList
          categories={categories}
          setCategory={setCategory}
          setIsShowCategory={setIsShowCategory}
          setCategories={setCategories}
          token={token}
        />
      )}
    </Layout>
  )
}

export async function getServerSideProps() {
  const res = await fetch(`${API_URL}/api/categories`)
  const { categories } = await res.json()
  if (!res.ok) {
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
