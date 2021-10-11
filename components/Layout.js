import styles from '@/styles/Layout.module.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Head from 'next/head'

export default function Layout({ children, title, keywords, description, products, currencyRate }) {
  
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name='description' content={description} />
        <meta name='keywords' content={keywords}/>
      </Head>
      <Header products={products} currencyRate={currencyRate}/>
      <div className={styles.container}>
        {children}
      </div>
      
      <Footer/>
    </div>
  )
}
