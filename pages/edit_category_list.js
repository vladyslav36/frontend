import AccessDenied from "@/components/AccessDenied"
import Layout from "@/components/Layout"
import AuthContext from "@/context/AuthContext"
import { useContext } from "react"
import styles from "@/styles/EditCategory.module.css"
import { getCategoriesTree } from "utils"
import { API_URL } from "../config"
import { FaPencilAlt, FaTimes } from "react-icons/fa"
import Link from "next/link"

export default function editCategoryListPage({ categories }) {
  const {
    user: { isAdmin },
  } = useContext(AuthContext)
  return (
    <div>
      <Layout title="Редактирование категории">
        {!isAdmin ? (
          <AccessDenied />
        ) : (
          <div className={styles.container}>
            {categories.map((item) => (
              <div key={item._id} className={styles.item}>
                <div className={styles.categoryTree}> {getCategoriesTree(item, categories)}</div>
                <div className={styles.buttons}>
                  <Link href={`/edit_category/${item.slug}`}><a className={styles.edit}><FaPencilAlt className={styles.icon} /></a></Link>
                  <Link href={`/delete_category/${item.slug}`}><a className={styles.delete}><FaTimes className={styles.icon}/></a></Link>
                  </div>
              </div>
            ))}
          </div>
        )}
      </Layout>
    </div>
  )
}

export async function getServerSideProps() {
  const data = await fetch(`${API_URL}/api/categories`)
  const { categories } = await data.json()
  return {
    props: {
      categories,
    },
  }
}
