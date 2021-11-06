import { createContext, useState, useEffect } from 'react'


const AuthContext = createContext()

export const AuthProvider=({ children }) =>{  
  const [user, setUser] = useState({})  
  
  
  
  return (
    <AuthContext.Provider value={{
      
      user:{isAdmin:true,token:''},
     setUser,
      
          
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
