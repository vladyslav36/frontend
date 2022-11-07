import styles from "@/styles/Form.module.scss"

import Modal from "@/components/Modal"
import ImageUpload from "@/components/ImageUpload"

import { useState,useEffect } from "react"
import { ToastContainer, toast } from "react-toastify"
import { FaImage, FaTimes } from "react-icons/fa"
import { useRouter } from "next/router"
import { API_URL, NOIMAGE} from "@/config/index"
import "react-toastify/dist/ReactToastify.css"
import { getCategoriesTree } from "../utils"
import Links from "@/components/Links"
import Options from "@/components/Options"

export default function EditCategory({ category,categories,setCategories, setIsShowCategory,token }) { 
  const [values, setValues] = useState({
    _id: category._id,
    name: category.name,
    parentCategory: category.parentCategory,
    parentCategoryId: category.parentCategoryId,
    description: category.description,
    options: category.options,
  })

  const [image, setImage] = useState({
    path: category.image ? `${API_URL}${category.image}` : "",
    file: null,
  })
  const [showModal, setShowModal] = useState(false)
  const [isShowList, setIsShowList] = useState(false)
  const [listForMenu, setListForMenu] = useState(getListForMenu(categories, ""))

  useEffect(() => {
    const names = categories.map((item) => item.name)
    const isExist = names.includes(values.parentCategory)
    if (!isExist) {
      setValues({ ...values, parentCategoryId: null })
    }
  }, [values.parentCategory])

  useEffect(() => {
    if (values.parentCategoryId) setValues({ ...values, options: {} })
  }, [values.parentCategoryId])

  const router = useRouter()
  // Функция возвращает список категорий в соответствии со строкой поиска
  function getListForMenu(categories, value) {
    const list = categories.filter(
      ({ name }) => name.toLowerCase().indexOf(value.toLowerCase()) >= 0
    )

    return list
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    // Проверка на заполнение поля имени категории
    const hasEmptyFields = !values.name.trim()
    if (hasEmptyFields) {
      toast.error("Поле Категория должно быть заполнено")
      return
    }
    // Проверка на наличие и соответствие родительской категории в категориях
    if (values.parentCategory) {
      const isValid = categories.some(
        (item) =>
          item.name === values.parentCategory &&
          item._id === values.parentCategoryId
      )
      if (!isValid) {
        toast.error("Родительская категория должна быть выбрана из списка")
        return
      }
    }

    // Проверка опций

    let error = false
    Object.keys(values.options).forEach((option) => {
      if (!Object.keys(values.options[option].values).length) {
        toast.warning("Опция введена без значений")
        error = true
      }
    })
    if (error) return

    // Send data
    const formData = new FormData()
    formData.append("values", JSON.stringify(values))
    formData.append("imageClientPath", image.path)
    formData.append("image", image.file)
    const res = await fetch(`${API_URL}/api/categories`, {
      method: "PUT",
      headers: {
        enctype: "multipart/form-data",
        authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    const data = await res.json()

    if (!res.ok) {
      toast.error(data.message)
    } else {
      setCategories(categories.map(item=>item._id!=data.category._id?item:data.category))
      setIsShowCategory(false)
     
    }
  }
  // input для name & description
  const handleChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    setValues({ ...values, [name]: value })
  }
  // input for parentCategory
  const handleChangeParent = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    setValues({ ...values, [name]: value })
    setIsShowList(true)
    setListForMenu(getListForMenu(categories, value))
  }

  const handleListClick = ({ id, name }) => {
    setValues({ ...values, parentCategory: name, parentCategoryId: id })
    setIsShowList(false)
  }

  const deleteImage = () => {
    URL.revokeObjectURL(image.path)
    setImage({ path: "", file: null })
  }

  return (
    <div>
      <div className={styles.form}>
        <form onSubmit={handleSubmit}>
          <div className={styles.header}>
            <Links home={true} />
            <div className={styles.buttons_flex_wrapper}>
              <input type='button' value='Отмена' className="btn" onClick={()=>setIsShowCategory(false) }/>
            <input type="submit" value="Сохранить" className="btn" />
            </div>
           
          </div>

          <ToastContainer />
          <div className={styles.grid}>
            <div>
              <label htmlFor="name">Категория</label>
              <input
                type="text"
                id="name"
                name="name"
                value={values.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="parentCategory">Родительская категория</label>
              <div
                className={styles.input_group_menu}
                tabIndex={0}
                onFocus={() => setIsShowList(true)}
                onBlur={() => setIsShowList(false)}
              >
                <input
                  type="text"
                  id="parentCategory"
                  name="parentCategory"
                  value={values.parentCategory}
                  onChange={handleChangeParent}
                  autoComplete="off"
                />
                <ul
                  className={
                    styles.dropdown_menu + " " + (isShowList && styles.active)
                  }
                >
                  {listForMenu &&
                    listForMenu.map((category) => (
                      <li
                        key={category._id}
                        onClick={() =>
                          handleListClick({
                            id: category._id,
                            name: category.name,
                          })
                        }
                      >
                        {getCategoriesTree(category, categories)}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="description">Описание</label>
            <textarea
              type="text"
              id="description"
              name="description"
              value={values.description}
              onChange={handleChange}
            ></textarea>
          </div>
        </form>
        <div>
          <p>Изображение категории</p>

          <div className={styles.image_container}>
            {image.path ? (
              <div className={styles.image}>
                <img src={image.path} />
              </div>
            ) : (
              <div className={styles.image}>
                <img src={`${NOIMAGE}`} alt="No Image" />
              </div>
            )}
            <div className={styles.image_footer}>
              <button
                className="btn"
                onClick={() => {
                  setShowModal(true)
                  setIsShowList(false)
                }}
              >
                <FaImage />
              </button>
              <button className="btn btn-danger" onClick={deleteImage}>
                <FaTimes />
              </button>
            </div>
          </div>
        </div>
        {!values.parentCategory ? (
          <Options values={values} setValues={setValues} />
        ) : null}
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <ImageUpload
          setShowModal={setShowModal}
          setImage={setImage}
          image={image}
        />
      </Modal>
    </div>
  )
}
