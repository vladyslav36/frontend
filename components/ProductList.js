import styles from "@/styles/ProductList.module.css"
import { API_URL } from "@/config/index"
import Image from "next/image"
import useSWR from "swr"
import Link from "next/link"
import { FaShoppingCart } from "react-icons/fa"

export default function ProductList({ categorySlug }) {
  const getProducts = (...arg) => fetch(...arg).then((res) => res.json())
  const { data, error } = useSWR(
    `${API_URL}/api/products/?categorySlug=${categorySlug}`,
    getProducts
  )
  if (error) return <div>Error</div>
  if (!data) return <div>Loading...</div>
  const { products } = data

  return (
    <div className={styles.container}>
      {products.map((product) => (
       
          <div key={product._id} className={styles.product}>
          <Link href={`/product/${product.slug}`}>
              <a className={styles.image}>
                <Image
                  src={`${API_URL}${product.image}`}
                  width={70}
                  height={70}
                />
              </a>
            </Link>

            <div className={styles.name}>{product.name}</div>
            <div className={styles.description}> {product.description}</div>
            <div className={styles.price}> {product.price}</div>
            <button className={styles.button}>
              <span><FaShoppingCart/>Купить</span>
            </button>
          </div>
       
      ))}
    </div>
  )
}
