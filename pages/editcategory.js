import AccessDenied from "@/components/AccessDenied"
import Layout from "@/components/Layout"
import AuthContext from "@/context/AuthContext"
import { useContext } from "react"

export default function editCategoryPage() {
  const {
    user: { isAdmin },
  } = useContext(AuthContext)
  return (
    <div>
      <Layout title="Редактирование категории">
        {!isAdmin ? <AccessDenied/> : <h1>For edit category</h1>}
      </Layout>
    </div>
  )
}
