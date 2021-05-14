import ShowcaseItem from '@/components/ShowcaseItem'
import styles from '@/styles/ShowCase.module.css'
export default function Showcase({showcaseProducts}) {
  return (
    <div className={styles.container}>
      {showcaseProducts && (
        showcaseProducts.map(product => <ShowcaseItem product={product} key={product._id}/>)
      )}
    </div>
  )
}
