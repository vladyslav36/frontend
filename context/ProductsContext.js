import { createContext, useEffect, useState } from "react"
import { API_URL } from "../config"

const ProductsContext = createContext()

export const ProductsProvider = ({ children }) => {
  const [currencyShop, setCurrencyShop] = useState("UAH")
  const [currencyRate, setCurrencyRate] = useState({})
  const [cart, setCart] = useState([])

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart"))
    setCart(cart ? cart : [])
  }, [])
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])
  useEffect(() => {
    const fetchRate = async () => {
      const res = await fetch(`${API_URL}/api/currencyrate`)
      const { currencyRate } = await res.json()
      setCurrencyRate(currencyRate || {})
    }
    fetchRate()
  },[])
  return (
    <ProductsContext.Provider
      value={{
        currencyShop,
        setCurrencyShop,
        currencyRate,
        setCurrencyRate,
        cart,
        setCart,
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export default ProductsContext
