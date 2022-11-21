import styles from "@/styles/Navbar.module.scss"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import { API_URL } from "../config"

export default function Navbar({ categories: categoriesProps }) {
  const router = useRouter()
  const [isShowRight, setIsShowRight] = useState(false)
  const [isShowCategories, setIsShowCategories] = useState(true)
  const [categories, setCategories] = useState([])
  const [catalogs, setCatalogs] = useState([])
  const elCategories = useRef()

  useEffect(() => {
    elCategories.current.checked = true
  }, [])

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

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch(`${API_URL}/api/catalogs`)
      if (res.ok) {
        const { catalogs } = await res.json()
        setCatalogs(catalogs)
      }
    }
    fetcher()
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
    <>
      <div className={styles.header}>
        <input
          id="categories"
          type="radio"
          name="radio_buttons"
          value="categories"
          onClick={() => setIsShowCategories(true)}
          ref={elCategories}
        />
        <label htmlFor="categories" title="Показать категории">
          <h5>Категории</h5>
        </label>

        <input
          id="catalogs"
          type="radio"
          name="radio_buttons"
          value="catalogs"
          onClick={() => setIsShowCategories(false)}
        />
        <label htmlFor="catalogs" title="Показать каталоги">
          <h5>Каталоги</h5>
        </label>
      </div>

      <div className={styles.container}>
        {isShowCategories ? (
          categories.length ? (
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
                        <span>{category.name}</span>
                        {getChildren(category, categories).length ? (
                          <ul
                            className={
                              styles.drop_down_list +
                              " " +
                              (isShowRight
                                ? styles.right_side
                                : styles.left_side)
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
          ) : null
        ) : (
          <ul className={styles.list}>
            {catalogs.length
              ? catalogs
                  .sort((a, b) => (a.name > b.name ? 1 : -1))
                  .map((item) => (
                    <li key={item._id} className={styles.category}>
                      {item.name}
                    </li>
                  ))
              : null}
          </ul>
        )}
      </div>
    </>
  )
}
