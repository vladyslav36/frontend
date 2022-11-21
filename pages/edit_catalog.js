import AccessDenied from "@/components/AccessDenied"
import Layout from "@/components/Layout"
import AuthContext from "@/context/AuthContext"
import { useContext, useState } from "react"
import { API_URL } from "../config"
import EditCatalog from "../components/EditCatalog"
import EditCatalogList from "../components/EditCatalogList"

export default function editCatalog({ catalogs:dbCatalogs }) {
  const {
    user: { isAdmin, token },
  } = useContext(AuthContext)
  const [catalogs, setCatalogs] = useState(dbCatalogs)
  const [isShowCatalog, setIsShowCatalog] = useState(false)
  const [catalog, setCatalog] = useState({})

  return (
    <Layout title="Редактирование каталогов">
      {!isAdmin ? (
        <AccessDenied />
      ) : isShowCatalog ? (
        <EditCatalog
          catalog={catalog}
          catalogs={catalogs}
          setCatalogs={setCatalogs}
          setIsShowCatalog={setIsShowCatalog}
          token={token}
        />
      ) : (
        <EditCatalogList
          catalogs={catalogs}
          setCatalog={setCatalog}
          setIsShowCatalog={setIsShowCatalog}
          setCatalogs={setCatalogs}
          token={token}
        />
      )}
    </Layout>
  )
}

export async function getServerSideProps() {
  const res = await fetch(`${API_URL}/api/catalogs`)
  const { catalogs } = await res.json()
  if (!res.ok) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      catalogs,
    },
  }
}
