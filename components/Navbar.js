import styles from "@/styles/Navbar.module.scss"
import { useContext, useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import { API_URL } from "../config"
import ProductsContext from "@/context/ProductsContext"

export default function Navbar({ categories: categoriesProps, catalogs: catalogsProps }) {

  const { catToggle, setCatToggle } = useContext(ProductsContext)  
  const router = useRouter()
  const [isShowRight, setIsShowRight] = useState(false)  
  const [categories, setCategories] = useState([])
  const [catalogs, setCatalogs] = useState([]) 

  const fakeArray=Array(20)
  fakeArray.fill('')
  
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
    if (catalogsProps) {
      setCatalogs(catalogsProps)
    } else {
      fetcher()
    }
  }, [])

  const getChildren = (cat, catArray) => {
    return catArray.filter((item) => item.parentId === cat._id)
  }
  
 
  // Вычисление с какой стороны показывать выпадающий список справа или слева
  const getSpace = (e) => {
    const rightSpace = window.innerWidth - e.target.getBoundingClientRect().x
    setIsShowRight(rightSpace < 160 ? true : false)
  }
  // categoriesList список категорий формата {cat:категория-бренд,children:ее первые дети}
  const getCatList = (catArray) =>
    catArray
      .filter((item) => item.parentId === null)
      .sort((a, b) => (a.name > b.name ? 1 : -1))
      .map((cat) => {
        return {
          cat: cat,
          children: getChildren(cat, catArray).sort((a, b) =>
            a.name > b.name ? 1 : -1
          ),
        }
      })
    
  
  const categoriesList = getCatList(categories)
  const catalogsList = getCatList(catalogs)

  return (
    <>
      <div className={styles.header}>
        <input
          id="categories"
          type="radio"
          name="radio_buttons"
          value="categories"
          checked={catToggle === "categories"}
          onChange={(e) => setCatToggle(e.target.value)}
        />
        <label htmlFor="categories" title="Показать категории">
          <h5>Категории</h5>
        </label>

        <input
          id="catalogs"
          type="radio"
          name="radio_buttons"
          value="catalogs"
          checked={catToggle === "catalogs"}
          onChange={(e) => setCatToggle(e.target.value)}
        />
        <label htmlFor="catalogs" title="Показать каталоги">
          <h5>Каталоги</h5>
        </label>
      </div>

      <div className={styles.container}>
        {catToggle === "categories" ? (
          categoriesList.length ? (
            <ul className={styles.list}>
              {categoriesList.map((item,i) => (
                <li
                  
                  className={styles.category}
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/category/${item.cat._id}`)
                  }}
                  onMouseEnter={(e) => getSpace(e)}
                >
                  <p>{item.cat.name}</p>
                  {item.children.length ? (
                    <ul
                      className={
                        styles.drop_down_list +
                        " " +
                        (isShowRight ? styles.right_side : styles.left_side)
                      }
                    >
                      {item.children.map((child,i) => (
                        <li
                          
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/category/${child._id}`)
                          }}
                          key={i}
                        >
                          {child.name}&nbsp;({child.qntProducts})
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
              {fakeArray.map((item,i) => (
                <li className={styles.fakeItem} key={i}></li>
              ))}
            </ul>
          ) : null
        ) : catalogsList.length ? (
          <ul className={styles.list}>
            {catalogsList.map((item,i) => (
              <li
                className={styles.category}
                key={i}
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
                    {item.children.map((child,i) => (
                      <li
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/catalog/${child._id}`)
                        }}
                        key={i}
                      >
                        {child.name}&nbsp;({child.qntProducts})
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
            {fakeArray.map((item,i) => (
              <li className={styles.fakeItem} key={i}></li>
            ))}
          </ul>
        ) : null}
      </div>
    </>
  )
}
