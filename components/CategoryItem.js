import Link from "next/link"
import styles from "@/styles/CategoryItem.module.css"
import Image from "next/image"
import { API_URL }from '@/config/index'

export default function CategoryItem({ item, itemHref }) {
  return (
    <div className={styles.item}>
      <Link href={`${itemHref}/${item.slug}`}>
        <a className={styles.link}>
          <div className={styles.image}>
            {item.image && (
              <Image src={`${API_URL}${item.image}`} width={60} height={80} />
            )}
          </div>
          <div className={styles.name}>{item.name}</div>
        </a>
      </Link>
    </div>
  )
}
