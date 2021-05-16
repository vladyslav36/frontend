import { createContext,useState,useEffect } from 'react'
import { API_URL } from '@/config/index'


const ProductsContext = createContext()

export const ProductsProvider = ({ children })=>{
const [currencyShop, setCurrencyShop] = useState("UAH")
const [currencyRate, setCurrencyRate] = useState({
  UAH: 1,
  USD: 1,
  EUR: 1,
})

useEffect(() => {
  const fetchCurrency = async () => {
    const res = await fetch(`${API_URL}/api/currencyrate`)
    const { currencyRate } = await res.json()
    setCurrencyRate(currencyRate)
  }
  fetchCurrency()
}, [])
  return (
    <ProductsContext.Provider value={{
      currencyRate,
      currencyShop,
      setCurrencyRate,
      setCurrencyShop
    }}>
    {children}
    </ProductsContext.Provider>
  )
}

export default ProductsContext