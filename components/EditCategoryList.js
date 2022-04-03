import styles from "@/styles/EditCategory.module.css"
import { getCategoriesTree } from "../utils"
import { API_URL } from "../config"
import { FaPencilAlt, FaTimes } from "react-icons/fa"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Links from "@/components/Links"

export default function EditCategoryList({ categories,setCategory,setIsShowCategory,setCategories,token }) {  
  
  const arrayTree = categories.map((item) => {
    return { _id: item._id, tree: getCategoriesTree(item, categories) }
  })
  arrayTree.sort((a, b) => (a.tree > b.tree ? 1 : -1))

  const handleEditCategory = (id) => {
    setCategory(categories.find(item => item._id === id))
    setIsShowCategory(true)
  }

  const handleDeleteCategory = async (id) => {
    if (confirm("Уверены?")) {
      const isChildren = categories.some(item => item.parentCategoryId === id)
      if (isChildren) {
        toast.error('Сначала удалите все подкатегории в этой категории')
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
      }
    }
  }

  return (
    <div>
     
        <ToastContainer />
        
          <div className={styles.container}>
            <Links back={false} home={true} />
            <div className={styles.list_wrapper}>
              {categories.length
                ? arrayTree.map((item, key) => (
                    <div key={key} className={styles.item}>
                      {item.tree}
                      <div className={styles.buttons}>
                        
                          <button className={styles.edit} onClick={()=>handleEditCategory(item._id)}>
                            <FaPencilAlt className={styles.icon} />
                          </button>
                       

                        <button
                          className={styles.delete}
                          onClick={() => handleDeleteCategory(item._id)}
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


