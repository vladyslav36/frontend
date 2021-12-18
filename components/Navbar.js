import styles from "@/styles/Navbar.module.css"
import { useContext, useEffect, useState } from "react"
import AuthContext from "@/context/AuthContext"
import { useRouter } from "next/router"
import useSWR from "swr"
import { API_URL } from "../config"
import { getDisplayName } from "next/dist/next-server/lib/utils"


export default function Navbar() {
  const {
    user: { isAdmin },
  } = useContext(AuthContext)
  const router = useRouter()
const [isShowRight,setIsShowRight]=useState(false)
  const getChildren = (category, categories) => {
    return categories.filter((item) => item.parentCategoryId === category._id)
  }

  const { data: dataCat } = useSWR(`${API_URL}/api/categories`)
  
  // Вычисление с какой стороны показывать выпадающий список справа или слева
  const getSpace = (e) => {        
    const rightSpace = window.innerWidth - e.target.getBoundingClientRect().x  
    setIsShowRight(rightSpace<160?true:false)
  }

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
                      onMouseEnter={(e)=>getSpace(e)}
                    >
                      {category.name} 
                      {getChildren(category, dataCat.categories).length ? (
                        <ul className={styles.drop_down_list+' '+(isShowRight?styles.right_side: styles.left_side)}>
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
