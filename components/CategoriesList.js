import styles from "@/styles/CategoriesList.module.scss"
import { API_URL, NOIMAGE } from "@/config/index"
import { useRouter } from "next/router"

export default function CategoriesList({ categories = [] }) {
  const router=useRouter()
  return (
    <div className={styles.content}>
      {categories.length ? (
        categories.map((item, i) => (          
            <div className={styles.item} onClick={()=>router.push(`/category/${item._id}`)} key={i}>
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
        <h2>Нет подкатегорий</h2>
      )}
    </div>
  )
}
