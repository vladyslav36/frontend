import styles from "@/styles/CategoriesList.module.css"
import Link from "next/link"
import { API_URL } from "@/config/index"

export default function CategoriesList({ categories=[] }) {
  return (
    <div className={styles.content}>
      {categories.length ? (
        categories.map((item, i) => (
          <Link href={`/category/${item.slug}`} key={i}>
            <a>
          <div className={styles.item} >
            <div className={styles.image}>
              <img src={item.image?`${API_URL}${item.image}`:'/noimage.png'} alt="No image" />
            </div>
            <div className={item.name}>
              <p>{item.name}</p>
            </div>
          </div>
            </a>
          </Link>
        ))
      ):(<h2>Нет подкатегорий</h2>)}
    </div>
  )
}
