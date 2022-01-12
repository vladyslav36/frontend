import { createContext, useState, useEffect } from 'react'


const AuthContext = createContext()

export const AuthProvider=({ children }) =>{  
  const [user, setUser] = useState({})  
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    setUser(user ? user : {})
  },[])
  useEffect(() => {
    localStorage.setItem('user',JSON.stringify(user))
  },[user])
  return (
    <AuthContext.Provider value={{      
      user,
     setUser,          
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
