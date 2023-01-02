import styles from "@/styles/EditCategory.module.scss"
import { getCatTree } from "../utils"
import { API_URL } from "../config"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Links from "@/components/Links"
import { useRef, useState } from "react"

export default function EditCategoryList({
  categories,
  setCategory,
  setIsShowCategory,
  setCategories,
  token,
}) {
  const [catForDelete, setCatForDelete] = useState({})

  const elemModal = useRef()

  const arrayTree = categories.map((item) => {
    return {
      _id: item._id,
      tree: getCatTree(item, categories),
      name: item.name,
    }
  })
  arrayTree.sort((a, b) => (a.tree > b.tree ? 1 : -1))

  const handleEditCategory = (id) => {
    setCategory(categories.find((item) => item._id === id))
    setIsShowCategory(true)
  }

  const handleDeleteCategory = async ({ _id }) => {
    const isChildren = categories.some((item) => item.parentId === _id)
    if (isChildren) {
      toast.error("Сначала удалите все подкатегории в этой категории")
    }
    const res = await fetch(`${API_URL}/api/categories/${_id}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    const data = await res.json()
    if (!res.ok) {
      toast.error(data.message)
    } else {
      setCategories(categories.filter((item) => item._id !== _id))
    }
  }

  const handleModal = (item) => {
    elemModal.current.showModal()
    setCatForDelete(item)
  }
  const handle = (rez) => {
    if (rez) {
      handleDeleteCategory(catForDelete)
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
          {categories.length
            ? arrayTree.map((item, key) => (
                <div key={key} className={styles.item}>
                  {item.tree}
                  <div className={styles.buttons}>
                    <button
                      className={styles.edit}
                      onClick={() => handleEditCategory(item._id)}
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
          <div>Удалить категорию {catForDelete.name}?</div>
          <div onClick={() => handle(true)}>Да</div>
          <div onClick={() => handle(false)}>Нет</div>
        </div>
      </dialog>
    </div>
  )
}
