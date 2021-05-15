import { createContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider=({ children }) =>{
  const [currencyShop,setCurrencyShop]=useState('UAH')
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const [currencyRate, setCurrencyRate] = useState({
    UAH: 1,
    USD: 1,
    EUR:1
  })
  
  // login
  const login = () => {
    console.log('login')
  }
// logout
  const logout = () => {
    console.log('logout')
  }
// register
  const register = () => {
    console.log('register')
  }
  return (
    <AuthContext.Provider value={{
      login,
      logout,
      user,
      error,
      register,
      currencyShop,
      setCurrencyShop,
      currencyRate,
      setCurrencyRate
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
