import { createContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider=({ children }) =>{
  const [currencyValue,setCurrencyValue]=useState('UAH')
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const [currencyRate,setCurrencyRate]=useState(null)
  
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
      currencyValue,
      setCurrencyValue,
      setCurrencyRate,
      currencyRate
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
