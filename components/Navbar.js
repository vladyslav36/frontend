import styles from "@/styles/Navbar.module.css"
import { useContext } from "react"
import AuthContext from "@/context/AuthContext"
import { FaPlus, FaEdit } from "react-icons/fa"
import Link from "next/link"

export default function Navbar({ categories }) {
  const {
    user: { isAdmin },
  } = useContext(AuthContext)
  
  return (
    <div className={styles.container}>
      {categories && (
        <ul className={styles.list}>
          {categories.map(
            (category) =>
              category.level === 0 && (
                <Link href={`/category/${category.slug}`} key={category._id} >
                  <li  className={styles.category}>
                    {category.name}
                    <ul className={styles.drop_down_list}>
                      {categories
                        .filter(
                          (item) => item.parentCategoryId === category._id
                        )
                        .map((item) => (
                          <Link href={`/category/${category.slug}/${item.slug}`} key={item._id}>
                            <li >{item.name}</li>
                          </Link>
                        ))}
                    </ul>
                  </li>
                </Link>
              )
          )}
        </ul>
      )}
      {isAdmin && (
        <div className={styles.adminPanel}>
          <div>
            <Link href="/add_category">
              <a>
                <FaPlus className={styles.icon} />
              </a>
            </Link>
          </div>

          <div>
            <Link href="/edit_category_list">
              <a>
                <FaEdit className={styles.icon} />
              </a>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
