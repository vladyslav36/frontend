import styles from "@/styles/Navbar.module.css"
import { useContext, useEffect, useState } from "react"
import AuthContext from "@/context/AuthContext"
import { useRouter } from "next/router"
import useSWR from "swr"
import { API_URL } from "../config"


export default function Navbar() {
  const {
    user: { isAdmin },
  } = useContext(AuthContext)
  const router = useRouter()

  const getChildren = (category, categories) => {
    return categories.filter((item) => item.parentCategoryId === category._id)
  }

  const { data: dataCat } = useSWR(`${API_URL}/api/categories`)
  

  

  return (
    <div className={styles.container}>
      {dataCat
        && dataCat.categories.length ?(
            <ul className={styles.list}>
              {dataCat.categories.map(
                (category) =>
                  category.parentCategoryId === null && (
                    <li
                      className={styles.category}
                      key={category._id}
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/category/${category.slug}`)
                      }}
                    >
                      {category.name}
                      {getChildren(category, dataCat.categories).length ? (
                        <ul className={styles.drop_down_list}>
                          {getChildren(category, dataCat.categories).map(
                            (item) => (
                              <li
                                onClick={(e) => {
                                  e.stopPropagation()
                                  router.push(`/category/${item.slug}`)
                                }}
                                key={item._id}
                              >
                                {item.name}&nbsp;({item.qntProducts})
                                
                              </li>
                            )
                          )}
                        </ul>
                      ) : null}
                    </li>
                  )
              )}
            </ul>
          )
        : null}
    </div>
  )
}
