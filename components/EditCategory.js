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
import ModalPrice from "./ModalPrice"
import ModalCatalog from "./ModalCatalog"
import {
  FaCloudDownloadAlt,
  FaImage,
  FaSave,
  FaTimes,
  FaWindowClose,
} from "react-icons/fa"

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
    parent: category.parent,
    parentId: category.parentId,
    description: category.description,
    options: category.options,
  })

  const [image, setImage] = useState({
    path: category.image ? `${API_URL}${category.image}` : "",
    file: null,
  })
  const [price, setPrice] = useState({
    path: category.price ? `${API_URL}${category.price}` : "",
    file: null,
  })
  const [catalog, setCatalog] = useState({
    path: category.catalog ? `${API_URL}${category.catalog}` : "",
    file: null,
  })

  const elDialog = useRef()
  const elDialogPrice = useRef()
  const elDialogCatalog = useRef()
  const listForMenu = getListForCategoriesMenu(categories)

  useEffect(() => {
    if (values.parentId) setValues({ ...values, options: {} })
  }, [values.parentId])

  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Проверка на заполнение поля имени категории
    const hasEmptyFields = !values.name.trim()
    if (hasEmptyFields) {
      toast.error("Поле Категория должно быть заполнено")
      return
    }
    if (values._id === values.parentId) {
      toast.error("Категория не может быть родителем самой себя")
      setValues({ ...values, parentId: null, parent: "" })

      return
    }

    // Проверка опций

    let error = false
    Object.keys(values.options).forEach((option) => {
      if (!Object.keys(values.options[option]).length) {
        toast.warning("Опция введена без значений")
        error = true
      }
    })
    if (error) return

    // Send data
    const formData = new FormData()
    formData.append("values", JSON.stringify(values))
    formData.append("imageClientPath", image.path)
    formData.append("priceClientPath", price.path)
    formData.append("catalogClientPath", catalog.path)
    formData.append("image", image.file)
    formData.append("price", price.file)
    formData.append("catalog", catalog.file)
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
    elDialog.current.close()
  }
  const handleUploadPrice = (e) => {
    setPrice({ path: "/", file: e.target.files[0] })
    elDialogPrice.current.close()
  }
  const handleUploadCatalog = (e) => {
    setCatalog({ path: "/", file: e.target.files[0] })
    elDialogCatalog.current.close()
  }
  const handleListClick = ({ id, name }) => {
    setValues({ ...values, parent: name, parentId: id })
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

            <div className={styles.right_icons}>
              <FaWindowClose
                className={styles.icon}
                title="Отмена"
                name="cancel"
                onClick={() => setIsShowCategory(false)}
              />
              <FaSave
                className={styles.icon}
                title="Сохранить"
                name="save"
                onClick={handleSubmit}
              />
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
              <label htmlFor="parent">Родительская категория</label>
              <div className={styles.input_group_menu}>
                <input
                  type="text"
                  id="parent"
                  name="parent"
                  value={values.parent}
                  onChange={handleChange}
                  autoComplete="off"
                />
                <div
                  className={styles.cancell}
                  onClick={() =>
                    setValues({
                      ...values,
                      parent: "",
                      parentId: null,
                    })
                  }
                >
                  <FaTimes />
                </div>
                <ul className={styles.dropdown_menu}>
                  {listForMenu &&
                    listForMenu.map((item, i) => (
                      <li
                        key={i}
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
          <div className={styles.image_header}>
            <p>Изображение категории</p>
            {category.parentId === null ? (
              <div>
                <div>
                  <FaCloudDownloadAlt
                    onClick={() => {
                      elDialogPrice.current.showModal()
                    }}
                    title="Загрузить прайс"
                  />

                  {price.path ? (
                    <FaWindowClose
                      onClick={() => setPrice({ path: "", file: null })}
                      title="Удалить прайс"
                    />
                  ) : null}

                  <p>Прайс</p>
                </div>
                <div>
                  <FaCloudDownloadAlt
                    onClick={() => {
                      elDialogCatalog.current.showModal()
                    }}
                    title="Загрузить каталог"
                  />

                  {catalog.path ? (
                    <FaWindowClose
                      onClick={() => setCatalog({ path: "", file: null })}
                      title="Удалить каталог"
                    />
                  ) : null}

                  <p>Каталог</p>
                </div>
              </div>
            ) : null}
          </div>

          <div className={styles.image_container}>
            {image.path ? (
              <div className={styles.image}>
                <img src={image.path} />
              </div>
            ) : (
              <div className={styles.image}>
                <img src={`${NOIMAGE}`} />
              </div>
            )}
            <div className={styles.image_footer}>
              <FaImage
                onClick={() => {
                  elDialog.current.showModal()
                }}
                name="save"
                title="Сохранить"
              />
              <FaWindowClose
                onClick={deleteImage}
                name="delete"
                title="Удалить"
              />
            </div>
          </div>
        </div>

        {!values.parent ? (
          <Options values={values} setValues={setValues} />
        ) : null}
      </div>

      <ModalImage elDialog={elDialog} handleUploadChange={handleUploadChange} />
      <ModalPrice
        elDialogPrice={elDialogPrice}
        handleUploadPrice={handleUploadPrice}
      />
      <ModalCatalog
        elDialogCatalog={elDialogCatalog}
        handleUploadCatalog={handleUploadCatalog}
      />
    </div>
  )
}
