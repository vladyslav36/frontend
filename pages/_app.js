import '../styles/globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { ProductsProvider } from '@/context/ProductsContext'

function MyApp({ Component, pageProps }) {
  
  return (
    <AuthProvider>
      <ProductsProvider>
        <Component {...pageProps} />
      </ProductsProvider>      
    </AuthProvider>
      
    
  )
  
}

export default MyApp
