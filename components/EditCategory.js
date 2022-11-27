import styles from "@/styles/Form.module.scss"
import { useState, useEffect, useRef } from "react"
import { ToastContainer, toast } from "react-toastify"
import { useRouter } from "next/router"
import { API_URL, NOIMAGE } from "@/config/index"
import "react-toastify/dist/ReactToastify.css"
import Links from "@/components/Links"
import Options from "@/components/Options"
import { getListForCategoriesMenu } from "../utils"
import ModalImage from "./ModalImage"

export default function EditCategory({
  category,
  categories,
  setCategories,
  setIsShowCategory,
  token,
}) {
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
  const elDialog = useRef()
  const listForMenu = getListForCategoriesMenu(categories)

  useEffect(() => {
    if (values.parentCategoryId) setValues({ ...values, options: {} })
  }, [values.parentCategoryId])

  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Проверка на заполнение поля имени категории
    const hasEmptyFields = !values.name.trim()
    if (hasEmptyFields) {
      toast.error("Поле Категория должно быть заполнено")
      return
    }
    if (values._id === values.parentCategoryId) {
      toast.error("Категория не может быть родителем самой себя")
      setValues({ ...values, parentId: null, parent: "" })

      return
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
      setCategories(
        categories.map((item) =>
          item._id != data.category._id ? item : data.category
        )
      )
      setIsShowCategory(false)
    }
  }
  // input для name & description
  const handleChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    if (name === "name") {
      setValues({ ...values, [name]: value })
    } else {
      toast.warning("Родительская категория выбирается из выпадающего списка")
    }
  }

  const handleUploadChange = (e) => {
    const url = URL.createObjectURL(e.target.files[0])
    URL.revokeObjectURL(image.path)
    setImage({ path: url, file: e.target.files[0] })
  }

  const handleListClick = ({ id, name }) => {
    setValues({ ...values, parentCategory: name, parentCategoryId: id })
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
            <Links home={true} back={true} />

            <span>
              <i
                className="fa-solid fa-square-xmark fa-2xl"
                title="Отмена"
                name="cancel"
                onClick={() => setIsShowCategory(false)}
              ></i>
              <i
                className="fa-solid fa-floppy-disk fa-2xl"
                title="Сохранить"
                name="save"
                onClick={handleSubmit}
              ></i>
            </span>
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
              <div className={styles.input_group_menu}>
                <input
                  type="text"
                  id="parentCategory"
                  name="parentCategory"
                  value={values.parentCategory}
                  onChange={handleChange}
                  autoComplete="off"
                />
                <div
                  className={styles.cancell}
                  onClick={() =>
                    setValues({
                      ...values,
                      parentCategory: "",
                      parentCategoryId: null,
                    })
                  }
                >
                  <i className="fa-solid fa-xmark fa-lg"></i>
                </div>
                <ul className={styles.dropdown_menu}>
                  {listForMenu &&
                    listForMenu.map((item) => (
                      <li
                        key={item.cat._id}
                        onClick={() =>
                          handleListClick({
                            id: item.cat._id,
                            name: item.cat.name,
                          })
                        }
                      >
                        {item.tree}
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
                  elDialog.current.showModal()
                }}
              >
                <i className="fa-regular fa-image"></i>
              </button>
              <button className="btn btn-danger" onClick={deleteImage}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
        </div>
        {!values.parentCategory ? (
          <Options values={values} setValues={setValues} />
        ) : null}
      </div>

      <ModalImage elDialog={elDialog} handleUploadChange={handleUploadChange} />
    </div>
  )
}
