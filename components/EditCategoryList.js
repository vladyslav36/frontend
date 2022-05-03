import styles from "@/styles/EditCategory.module.css"
import { getCategoriesTree } from "../utils"
import { API_URL } from "../config"
import { FaPencilAlt, FaTimes } from "react-icons/fa"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Links from "@/components/Links"
import Confirm from "./Confirm"
import { useState } from "react"

export default function EditCategoryList({
  categories,
  setCategory,
  setIsShowCategory,
  setCategories,
  token,
}) {
  // Компонент Confirm берет аргументами isShow и аргументы товара или категориии которые надо удалить,
  //  сохраняет их в стейте и затем в Confirm передается функция удаления вместе с аргуиентми
  const [isShowConfirm, setIsShowConfirm] = useState(false)
  const [deleteArg, setDeleteArg] = useState({})

  const arrayTree = categories.map((item) => {
    return {
      _id: item._id,
      tree: getCategoriesTree(item, categories),
      name: item.name,
    }
  })
  arrayTree.sort((a, b) => (a.tree > b.tree ? 1 : -1))

  const handleEditCategory = (id) => {
    setCategory(categories.find((item) => item._id === id))
    setIsShowCategory(true)
  }

  const handleDeleteCategory = async ({ id }) => {
    const isChildren = categories.some((item) => item.parentCategoryId === id)
    if (isChildren) {
      toast.error("Сначала удалите все подкатегории в этой категории")
    }
    const res = await fetch(`${API_URL}/api/categories/${id}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    const data = await res.json()
    if (!res.ok) {
      toast.error(data.message)
    } else {
      setCategories(categories.filter((item) => item._id !== id))
      setDeleteArg({})
    }
  }

  return (
    <div>
      <ToastContainer />
      {isShowConfirm ? (
        <Confirm
          itemName={deleteArg.name}
          setIsShowConfirm={setIsShowConfirm}
          setDeleteArg={setDeleteArg}
          handleDelete={() => handleDeleteCategory(deleteArg)}
        />
      ) : null}
      <div className={styles.container}>
        <Links back={false} home={true} />
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
                      <FaPencilAlt className={styles.icon} />
                    </button>

                    <button
                      className={styles.delete}
                      // onClick={() => handleDeleteCategory(item._id)}
                      onClick={() => {
                        setIsShowConfirm(true)
                        setDeleteArg({ id: item._id, name: item.name })
                      }}
                    >
                      <span>
                        <FaTimes className={styles.icon} />
                      </span>
                    </button>
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>
    </div>
  )
}
