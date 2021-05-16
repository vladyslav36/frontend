import styles from "@/styles/Navbar.module.css"

export default function Navbar({ categories }) {
  return (
    <div className={styles.container}>
      {categories && (
        <ul className={styles.list}>
          {categories.map((category) => (
            <li key={category._id} className={styles.category}>
              {category.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
