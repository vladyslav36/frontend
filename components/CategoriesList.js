import styles from "@/styles/CategoriesList.module.css"
import Link from "next/link"
import { API_URL, NOIMAGE } from "@/config/index"

export default function CategoriesList({ categories = [] }) {
  const fakeArray = ["", "", "", "", "", "", ""]
  return (
    <div className={styles.content}>
      <>
        {categories.length ? (
          categories.map((item, i) => (
            <Link href={`/category/${item.slug}`} key={i}>
              <div className={styles.item}>
                <div className={styles.image}>
                  <img
                    src={item.image ? `${API_URL}${item.image}` : `${NOIMAGE}`}
                    alt="No image"
                  />
                </div>
                <div className={item.name}>
                  <p>
                    {item.name}&nbsp;({item.qntProducts})
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <h2>Нет подкатегорий</h2>
        )}
        {fakeArray.map((item, i) => (
          <div className={styles.fake_image} key={i}></div>
        ))}
      </>
    </div>
  )
}
