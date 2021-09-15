import styles from "@/styles/Navbar.module.css"
import { useContext } from "react"
import AuthContext from "@/context/AuthContext"
import ProductsContext from "@/context/ProductsContext"
import { FaPlus, FaEdit } from "react-icons/fa"
import Link from "next/link"
import { fetchCategories, fetchProductsCategoryId } from "dataFetchers"
import Spinner from "@/components/Spinner"
import { API_URL } from "../config"
import { useRouter } from "next/router"

export default function Navbar() {
  const {
    user: { isAdmin },
  } = useContext(AuthContext)

  const { setProductList } = useContext(ProductsContext)

  const router = useRouter()

  const { data, error, isLoading } = fetchCategories()
  if (isLoading) return <Spinner />
  const { categories } = data

  const getChildren = (category, categories) => {
    return categories.filter((item) => item.parentCategoryId === category._id)
  }

  
  return (
    <div className={styles.container}>
      {categories.length && (
        <ul className={styles.list}>
          {categories.map(
            (category) =>
              category.level === 0 && (
                <li
                  className={styles.category}
                  key={category._id}
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/category/${category.slug}`)
                  }}
                >
                  {category.name}
                  {getChildren(category, categories).length ? (
                    <ul className={styles.drop_down_list}>
                      {getChildren(category, categories).map((item) => (
                        <li
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/category/${item.slug}`)
                          }}
                          key={item._id}
                        >
                          {item.name}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              )
          )}
        </ul>
      )}
    </div>
  )
}
