import '../styles/globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { ProductsProvider } from '@/context/ProductsContext'
import { SWRConfig } from 'swr'

function MyApp({ Component, pageProps }) {
  
  return (
    <SWRConfig value={{      
      fetcher:(resourse,init)=>fetch(resourse,init).then(res=>res.json())
    }}>
      <AuthProvider>
      <ProductsProvider>
        <Component {...pageProps} />
      </ProductsProvider>      
    </AuthProvider>
    </SWRConfig>     
    
  )
  
}

export default MyApp
