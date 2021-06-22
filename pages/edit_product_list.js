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

export default function editProductListPage({ products }) {
  const {
    user: { isAdmin },
  } = useContext(AuthContext)
  const router = useRouter()
  const handleDeleteProduct = async (id) => {
    if (confirm("Уверены?")) {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
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
      <Layout title="Редактирование товаров">
        <ToastContainer />
        {!isAdmin ? (
          <AccessDenied />
        ) : (
          <div className={styles.container}>
            <h2>Список товаров</h2>
            <Link href="/">На главную</Link>
            {products.map((item) => (
              <div key={item._id} className={styles.item}>
                <div>
                  {item.name}
                </div>
                <div className={styles.buttons}>
                  <Link href={`/edit_product/${item.slug}`}>
                    <a className={styles.edit}>
                      <FaPencilAlt className={styles.icon} />
                    </a>
                  </Link>

                  <button
                    className={styles.delete}
                    onClick={() => handleDeleteProduct(`${item._id}`)}
                  >
                    <span>
                      <FaTimes className={styles.icon} />
                    </span>
                  </button>
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
  const data = await fetch(`${API_URL}/api/products`)
  const { products } = await data.json()
  return {
    props: {
      products,
    },
  }
}
