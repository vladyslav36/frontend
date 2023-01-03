import styles from "@/styles/CategoriesList.module.scss"

import { API_URL, NOIMAGE } from "@/config/index"
import { useRouter } from "next/router"

export default function CatalogsList({ catalogs = [] }) {
const router=useRouter()
  return (
    <div className={styles.content}>
      {catalogs.length ? (
        catalogs.map((item, i) => (          
            <div className={styles.item} onClick={()=>router.push(`/catalog/${item._id}`)} key={i}>
              <div className={styles.image}>
                <img
                  src={item.image ? `${API_URL}${item.image}` : `${NOIMAGE}`}                  
                />
              </div>
              <div className={styles.item_name}>
                {item.name}&nbsp;({item.qntProducts})
              </div>
            </div>          
        ))
      ) : (
        <h2>Нет подкаталогов</h2>
      )}
    </div>
  )
}
