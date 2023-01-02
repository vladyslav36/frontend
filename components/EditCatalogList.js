import styles from "@/styles/EditCategory.module.scss"
import { getCatTree } from "../utils"
import { API_URL } from "../config"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Links from "@/components/Links"
import { useRef, useState } from "react"

export default function EditCatalogList({
  catalogs,
  setCatalog,
  setIsShowCatalog,
  setCatalogs,
  token,
}) {
  const [catForDelete, setCatForDelete] = useState({})

  const elemModal = useRef()

  const arrayTree = catalogs.map((item) => {
    return {
      _id: item._id,
      tree: getCatTree(item, catalogs),
      name: item.name,
    }
  })
  arrayTree.sort((a, b) => (a.tree > b.tree ? 1 : -1))

  const handleEditCatalog = (id) => {
    setCatalog(catalogs.find((item) => item._id === id))
    setIsShowCatalog(true)
  }

  const handleDeleteCatalog = async ({ _id }) => {
    const isChildren = catalogs.some((item) => item.parentId === _id)
    if (isChildren) {
      toast.error("Сначала удалите все подкаталоги в этом каталоге")
    }
    const res = await fetch(`${API_URL}/api/catalogs/${_id}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    const data = await res.json()
    if (!res.ok) {
      toast.error(data.message)
    } else {
      const res = await fetch(`${API_URL}/api/catalogs`)
      const { catalogs: newCatalogs } = await res.json()
      setCatalogs(newCatalogs)
    }
  }

  const handleModal = (item) => {
    elemModal.current.showModal()
    setCatForDelete(item)
  }
  const handle = (rez) => {
    if (rez) {
      handleDeleteCatalog(catForDelete)
    }
    setCatForDelete({})
    elemModal.current.close()
  }
  return (
    <div>
      <ToastContainer />
      <div className={styles.container}>
        <div className={styles.header}>
          <Links back={false} home={true} />
        </div>
        <div className={styles.list_wrapper}>
          {catalogs.length
            ? arrayTree.map((item, key) => (
                <div key={key} className={styles.item}>
                  {item.tree}
                  <div className={styles.buttons}>
                    <button
                      className={styles.edit}
                      onClick={() => handleEditCatalog(item._id)}
                    >
                      <i className="fa-solid fa-pencil"></i>
                    </button>

                    <button
                      className={styles.delete}
                      onClick={() => handleModal(item)}
                    >
                      <i className="fa-solid fa-xmark fa-lg"></i>
                    </button>
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>
      <dialog className={styles.dialog} ref={elemModal}>
        <div className={styles.dialog_wrapper}>
          <div>Удалить каталог {catForDelete.name}?</div>
          <div onClick={() => handle(true)}>Да</div>
          <div onClick={() => handle(false)}>Нет</div>
        </div>
      </dialog>
    </div>
  )
}
