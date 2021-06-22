import styles from "@/styles/EditBrand.module.css"
import Layout from "@/components/Layout"
import Link from "next/link"
import { API_URL } from "../config"
import { FaPencilAlt, FaTimes } from "react-icons/fa"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useRouter } from "next/router"

export default function edit_brand_listPage({ brands }) {
  const router = useRouter()
  const handleDeleteBrand = async (id) => {
    if (confirm("Уверены?")) {
      const res = await fetch(`${API_URL}/api/brands/${id}`, {
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
    <Layout title="Список брендов">
      <ToastContainer />
      <div className={styles.container}>
        <h3>Бренды</h3>
        <Link href="/">Вернуться на главную</Link>
        {brands.map((item) => (
          <div key={item._id} className={styles.item}>
            {item.name}
            <div className={styles.buttons}>
              <Link href={`/edit_brand/${item.slug}`}>
                <a className={styles.edit}>
                  <FaPencilAlt className={styles.icon} />
                </a>
              </Link>
              <button
                className={styles.delete}
                onClick={() => handleDeleteBrand(`${item._id}`)}
              >
                <span>
                  <FaTimes className={styles.icon} />
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}

export async function getServerSideProps() {
  const res = await fetch(`${API_URL}/api/brands`)
  const { brands } = await res.json()
  if (!res.ok) {
    return {
      redirect: "/serverError",
    }
  }
  return {
    props: {
      brands,
    },
  }
}
