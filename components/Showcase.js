import styles from '@/styles/ShowCase.module.css'
import ShowcaseItem from '@/components/ShowcaseItem'
export default function Showcase({ showcaseProducts }) {
  
  return (
    <div className={styles.container}>
      {showcaseProducts && (
        showcaseProducts.map(product => <ShowcaseItem product={product} key={product._id}/>)
      )}
    </div>
  )
}
