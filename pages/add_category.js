import styles from "@/styles/Form.module.css"
import AccessDenied from "@/components/AccessDenied"
import Layout from "@/components/Layout"
import Modal from "@/components/Modal"
import ImageUpload from "@/components/ImageUpload"
import AuthContext from "@/context/AuthContext"
import { useContext, useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import { FaImage, FaTimes } from "react-icons/fa"
import { useRouter } from "next/router"
import Link from "next/link"

import { API_URL, NOIMAGE_PATH } from "@/config/index"
import "react-toastify/dist/ReactToastify.css"
import { getCategoriesTree } from "../utils"
import Links from "@/components/Links"

export default function addCategoryPage({ categories }) {
  const {
    user: { isAdmin,token },
  } = useContext(AuthContext)
  const [values, setValues] = useState({
    name: "",
    parentCategory: "",
    parentCategoryId: null,
    description: "",
  })

  const [showModal, setShowModal] = useState(false)
  const [isShowList, setIsShowList] = useState(false)
  const [image, setImage] = useState({ path: "", file: null })

  const [listForMenu, setListForMenu] = useState(getListForMenu(categories, ""))

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
    } else {
      values.parentCategoryId = null
    }

    // Send data
    const formData = new FormData()
    formData.append("values", JSON.stringify(values))
    formData.append("image", image.file)
    const res = await fetch(`${API_URL}/api/categories`, {
      method: "POST",
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
      router.push("/")
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
      <Layout title="Добавление категории">
        {!isAdmin ? (
          <AccessDenied />
        ) : (
          <>
            <div className={styles.form}>
              <form onSubmit={handleSubmit}>
                <div className={styles.header}>
                  
                    <Links home={true} />
                 

                  <input type="submit" value="Сохранить" className="btn" />
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
                    <label htmlFor="parentCategory">
                      Родительская категория
                    </label>
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
                          styles.dropdown_menu +
                          " " +
                          (isShowList && styles.active)
                        }
                      >
                        {listForMenu && (
                          <>
                            {listForMenu.map((category) => (
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
                          </>
                        )}
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
                      <img src="/noimage.png" alt="No Image" />
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
            </div>
          </>
        )}
        <Modal show={showModal} onClose={() => setShowModal(false)}>
          <ImageUpload
            setShowModal={setShowModal}
            setImage={setImage}
            image={image}
          />
        </Modal>
      </Layout>
    </div>
  )
}

export async function getServerSideProps() {
  const data = await fetch(`${API_URL}/api/categories`)
  const { categories } = await data.json()
  if (!data  || !categories) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      categories,
    },
  }
}
