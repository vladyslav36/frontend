import styles from "@/styles/Navbar.module.scss"
import { useContext, useLayoutEffect, useState } from "react"
import { useRouter } from "next/router"
import { API_URL } from "../config"
import ProductsContext from "@/context/ProductsContext"

export default function Navbar() {
  const { catToggle, setCatToggle } = useContext(ProductsContext)
  const router = useRouter()
  const [categoriesList, setCategoriesList] = useState([])
  const [catalogsList, setCatalogsList] = useState([])

  const fakeArray = Array(20)
  fakeArray.fill("")

  useLayoutEffect(() => {
    const fetcher = async () => {
      const res = await fetch(`${API_URL}/api/categories/navbar`)
      if (res.ok) {
        const { categoriesList, catalogsList } = await res.json()
        setCategoriesList(categoriesList)
        setCatalogsList(catalogsList)
      }
    }

    fetcher()
  }, [])

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
            <div className={styles.list}>
              {categoriesList.map((item, i) => (
                <div className={styles.category_wrapper} key={i}>
                  <div
                    className={styles.category}
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/category/${item._id}`)
                    }}
                  >
                    <p>{item.name}</p>
                  </div>
                </div>
              ))}
              {fakeArray.map((item, i) => (
                <div className={styles.fakeItem} key={i}></div>
              ))}
            </div>
          ) : null
        ) : catalogsList.length ? (
          <div className={styles.list}>
            {catalogsList.map((item, i) => (
              <div className={styles.category_wrapper} key={i}>
                <div
                  className={styles.category}
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/catalog/${item._id}`)
                  }}
                >
                  <p>{item.name}</p>
                </div>
              </div>
            ))}
            {fakeArray.map((item, i) => (
              <div className={styles.fakeItem} key={i}></div>
            ))}
          </div>
        ) : null}
      </div>
    </>
  )
}
