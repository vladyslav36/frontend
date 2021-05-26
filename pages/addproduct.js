import AccessDenied from "@/components/AccessDenied";
import Layout from "@/components/Layout";
import AuthContext from "@/context/AuthContext"
import { useContext, useState } from "react"


export default function addProductPage() {
  const {
    user: { isAdmin },
  } = useContext(AuthContext)
  
  return (
    <div>
      <Layout title="Добавление товара">
        {!isAdmin ? <AccessDenied /> : <h1>For add products</h1>}
        
      </Layout>
    </div>
  )
}
