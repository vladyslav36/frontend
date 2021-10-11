import { createContext, useEffect, useState } from "react"

const ProductsContext = createContext()

export const ProductsProvider = ({ children }) => {
  const [currencyShop, setCurrencyShop] = useState("UAH")
  const [cart, setCart] = useState([])

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart"))
    setCart(cart ? cart : [])
  }, [])
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  return (
    <ProductsContext.Provider
      value={{
        currencyShop,
        setCurrencyShop,
        cart,
        setCart,
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export default ProductsContext
