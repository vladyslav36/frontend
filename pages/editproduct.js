import AccessDenied from "@/components/AccessDenied";
import Layout from "@/components/Layout";
import AuthContext from "@/context/AuthContext"
import { useContext } from "react"

export default function editProductPage() {
  const {
    user: { isAdmin },
  } = useContext(AuthContext)
  return (
    <div>
      <Layout title="Редактирование товара">
        {!isAdmin ? <AccessDenied/> : <h1> Page for edit products</h1>}
      </Layout>
    </div>
  )
}
