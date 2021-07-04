import styles from "@/styles/Navbar.module.css"
import { useContext } from "react"
import AuthContext from "@/context/AuthContext"
import { FaPlus, FaEdit } from "react-icons/fa"
import Link from "next/link"
import { fetchCategories } from "dataFetchers"
import Spinner from '@/components/Spinner'

export default function Navbar() {
  const {
    user: { isAdmin },
  } = useContext(AuthContext)

  const { data, error, isLoading } = fetchCategories()
  if (isLoading) return <Spinner />
  const { categories } = data

  const getChildren = (category, categories) => {
  return categories.filter(item=>item.parentCategoryId===category._id)
}
  return (
    <div className={styles.container}>
      {categories.length && (
        <ul className={styles.list}>
          {categories.map(
            (category) =>
              category.level === 0 && (
                <Link href={`/category/${category.slug}`} key={category._id}>
                  <li className={styles.category}>
                    {category.name}
                    {getChildren(category, categories).length ? (
                      <ul className={styles.drop_down_list}>
                        {getChildren(category, categories).map((item) => (
                          <Link
                            href={`/category/${category.slug}/${item.slug}`}
                            key={item._id}
                          >
                            <li>{item.name}</li>
                          </Link>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                </Link>
              )
          )}
        </ul>
      )}
     
    </div>
  )
}
