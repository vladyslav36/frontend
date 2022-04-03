import styles from "@/styles/Links.module.css"
import Link from "next/link"
import { useRouter } from "next/router"
import {  
  FaChevronCircleLeft,
  FaHome,
} from "react-icons/fa"

export default function Links({ home, back }) {
  const router = useRouter()
  return (
    <dir className={styles.links}>
      {back ? (
        <div onClick={() => router.back()} title='Назад'>
          <FaChevronCircleLeft />
        </div>
      ) : null}
      {home ? (
        <Link href="/">
          <a title='На главную'>
            <FaHome />
          </a>
        </Link>
      ) : null}
    </dir>
  )
}
