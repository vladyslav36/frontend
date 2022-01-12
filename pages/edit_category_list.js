import styles from "@/styles/EditCategory.module.css"
import AccessDenied from "@/components/AccessDenied"
import Layout from "@/components/Layout"
import AuthContext from "@/context/AuthContext"
import { useContext } from "react"
import { getCategoriesTree } from "utils"
import { API_URL } from "../config"
import { FaPencilAlt, FaTimes } from "react-icons/fa"
import Link from "next/link"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useRouter } from "next/router"
import Links from "@/components/Links"
import useSWR from "swr"

export default function editCategoryListPage({categories}) {
  const {
    user: { isAdmin,token },
  } = useContext(AuthContext)
  const router = useRouter()
  const handleDeleteCategory = async (id) => {
    if (confirm("Уверены?")) {
      const res = await fetch(`${API_URL}/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.message)
      } else {
        router.push(router.pathname)
      }
    }
  }

  

  return (
    <div>
      <Layout title="Редактирование категории">
        <ToastContainer />
        {!isAdmin ? (
          <AccessDenied />
        ) : (
          <div className={styles.container}>
              <Links back={false} home={true} />
              {categories.length ? (
                 categories.map((item) => (
              <div key={item._id} className={styles.item}>
                <div className={styles.categoryTree}>
                  {getCategoriesTree(item, categories)}
                </div>
                <div className={styles.buttons}>
                  <Link href={`/edit_category/${item.slug}`}>
                    <a className={styles.edit}>
                      <FaPencilAlt className={styles.icon} />
                    </a>
                  </Link>
                 
                  <button 
                    className={styles.delete}
                    onClick={() => handleDeleteCategory(`${item._id}`)}
                  >
                    <span>
                      <FaTimes className={styles.icon} />
                    </span>
                    
                  </button>
                </div>
              </div>
            ))
              ):null}
           
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
