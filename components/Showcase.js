import styles from '@/styles/ShowCase.module.css'
import ShowcaseItem from '@/components/ShowcaseItem'
import { fetchShowcaseProducts } from 'dataFetchers'
import Spinner from './Spinner'

export default function Showcase() {
  const { data, error, isLoading } = fetchShowcaseProducts()
  if (isLoading) return <Spinner />
  const { showcaseProducts } = data
  return (
    <div className={styles.container}>
      {showcaseProducts && (
        showcaseProducts.map(product => <ShowcaseItem product={product} key={product._id}/>)
      )}
    </div>
  )
}
