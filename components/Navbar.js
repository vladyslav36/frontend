import styles from "@/styles/Navbar.module.css"
import { useContext, useEffect, useState } from "react"
import AuthContext from "@/context/AuthContext"
import { fetchCategories } from "dataFetchers"
import Spinner from "@/components/Spinner"
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
  
  const { data } = useSWR(`${API_URL}/api/categories`)

  const categories = data ? data.categories : []
  const qnt = data ? data.qnt : {}
  return (
    <div className={styles.container}>
      {data?categories.length && (
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
                          {item.name}&nbsp;({qnt[item._id]})
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              )
          )}
        </ul>
      ):null}
    </div>
  )
}
