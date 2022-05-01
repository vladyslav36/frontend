import styles from '@/styles/Layout.module.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Head from 'next/head'

export default function Layout({ children, title, keywords, description }) {
  const schemaDate = {    
  "@context": "http://www.schema.org",
  "@type": "Organization",
  "name": "Karmen",
  "url": "https://karmen.in.ua",
  "sameAs": [
    "http://karmen.in.ua"
  ],
  "description": "Оптовый магазин по продаже чулочно-носочных изделий",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "г. Харбков, ТЦ Барабашово, маг. ВКМ-307",
    "addressLocality": "Харьков"
  },
  "openingHours": "Mo, Tu, We, Th, Sa, Su 08:00-14:30 Fr -",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+380509501671"
  }
  }
  
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name='description' content={description} />
        <meta name='keywords' content={keywords}/>
      </Head>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schemaDate)}}/>
      <div className={styles.container}>
        {children}
      </div>
      
      <Footer/>
    </div>
  )
}
