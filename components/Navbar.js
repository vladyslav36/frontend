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
  const getCatalogsChildren = (catalog, catalogs) => {
    return catalogs.filter((item) => item.parentId === catalog._id)
  }

  // Вычисление с какой стороны показывать выпадающий список справа или слева
  const getSpace = (e) => {
    const rightSpace = window.innerWidth - e.target.getBoundingClientRect().x
    setIsShowRight(rightSpace < 160 ? true : false)
  }
// categoriesList список категорий формата {cat:категория-бренд,children:ее первые дети}
  const categoriesList = categories.filter(item => item.parentCategoryId === null).sort((a,b)=>a.name>b.name?1:-1).map(cat => {
    return {cat:cat,children:getChildren(cat,categories).sort((a,b)=>a.name>b.name?1:-1)}
  })
  const catalogsList = catalogs.filter(item => item.parentId === null).sort((a,b)=>a.name>b.name?1:-1).map(cat => {
    return {cat:cat,children:getCatalogsChildren(cat,catalogs).sort((a,b)=>a.name>b.name?1:-1)}
  })


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
          categoriesList.length ? (
            <ul className={styles.list}>
              {categoriesList.map((item) => (
                <li
                  className={styles.category}
                  key={item.cat._id}
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/category/${item.cat._id}`)
                  }}
                  onMouseEnter={(e) => getSpace(e)}
                >
                  <span>{item.cat.name}</span>
                  {item.children.length ? (
                    <ul
                      className={
                        styles.drop_down_list +
                        " " +
                        (isShowRight ? styles.right_side : styles.left_side)
                      }
                    >
                      {item.children.map((child) => (
                        <li
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/category/${child._id}`)
                          }}
                          key={child._id}
                        >
                          {child.name}&nbsp;({child.qntProducts})
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null
        ) : catalogsList.length ? (
          <ul className={styles.list}>
            {catalogsList.map((item) => (
              <li
                className={styles.category}
                key={item.cat._id}
                onClick={(e) => {
                  e.stopPropagation()
                  router.push(`/catalog/${item.cat._id}`)
                }}
                onMouseEnter={(e) => getSpace(e)}
              >
                <span>{item.cat.name}</span>
                {item.children.length ? (
                  <ul
                    className={
                      styles.drop_down_list +
                      " " +
                      (isShowRight ? styles.right_side : styles.left_side)
                    }
                  >
                    {item.children.map((child) => (
                      <li
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/catalog/${child._id}`)
                        }}
                        key={child._id}
                      >
                        {child.name}&nbsp;({child.qntProducts})
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </>
  )
}
