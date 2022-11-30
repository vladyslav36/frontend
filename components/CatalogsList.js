import styles from "@/styles/CategoriesList.module.scss"
import Link from "next/link"
import { API_URL, NOIMAGE } from "@/config/index"

export default function CatalogsList({ catalogs = [] }) {
  return (
    <div className={styles.content}>
      {catalogs.length ? (
        catalogs.map((item, i) => (
          <Link href={`/catalog/${item._id}`} key={i}>
            <div className={styles.item}>
              <div className={styles.image}>
                <img
                  src={item.image ? `${API_URL}${item.image}` : `${NOIMAGE}`}
                  alt="No image"
                />
              </div>
              <div className={styles.item_name}>
                {item.name}&nbsp;({item.qntProducts})
              </div>
            </div>
          </Link>
        ))
      ) : (
        <h2>Нет подкаталогов</h2>
      )}
    </div>
  )
}
