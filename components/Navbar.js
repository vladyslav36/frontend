import styles from "@/styles/Navbar.module.css"
import { useContext, useEffect, useState } from "react"
import AuthContext from "@/context/AuthContext"
import { useRouter } from "next/router"
import { API_URL } from "../config"

export default function Navbar({ categories: categoriesProps }) {
  const {
    user: { isAdmin },
  } = useContext(AuthContext)
  const router = useRouter()
  const [isShowRight, setIsShowRight] = useState(false)
  const [categories, setCategories] = useState([])
  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch(`${API_URL}/api/categories`)
      if (res.ok) {
        const { categories } = await res.json()
        setCategories(categories)
      }
    }
    if (categoriesProps) {
      setCategories(categoriesProps)
    } else {
      fetcher()
    }
  }, [])

  const getChildren = (category, categories) => {
    return categories.filter((item) => item.parentCategoryId === category._id)
  }

  // Вычисление с какой стороны показывать выпадающий список справа или слева
  const getSpace = (e) => {
    const rightSpace = window.innerWidth - e.target.getBoundingClientRect().x
    setIsShowRight(rightSpace < 160 ? true : false)
  }

  return (
    <div className={styles.container}>
      {categories.length ? (
        <ul className={styles.list}>
          {categories
            .sort((a, b) => (a.name > b.name ? 1 : -1))
            .map(
              (category) =>
                category.parentCategoryId === null && (
                  <li
                    className={styles.category}
                    key={category._id}
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/category/${category.slug}`)
                    }}
                    onMouseEnter={(e) => getSpace(e)}
                  >
                    {category.name}
                    {getChildren(category, categories).length ? (
                      <ul
                        className={
                          styles.drop_down_list +
                          " " +
                          (isShowRight ? styles.right_side : styles.left_side)
                        }
                      >
                        {getChildren(category, categories).map((item) => (
                          <li
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/category/${item.slug}`)
                            }}
                            key={item._id}
                          >
                            {item.name}&nbsp;({item.qntProducts})
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                )
            )}
        </ul>
      ) : null}
    </div>
  )
}
