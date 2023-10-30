import styles from "@/styles/CategoryForm.module.scss"
import AccessDenied from "@/components/AccessDenied"
import Layout from "@/components/Layout"
import AuthContext from "@/context/AuthContext"
import { useContext, useState, useEffect } from "react"
import { ToastContainer, toast } from "react-toastify"
import { useRouter } from "next/router"
import { API_URL, NOIMAGE } from "@/config/index"
import "react-toastify/dist/ReactToastify.css"
import Links from "@/components/Links"
import Options from "@/components/Options"
import { getListForCategoriesMenu } from "../utils"
import ModalImage from "@/components/ModalImage"
import ModalPrice from "@/components/ModalPrice"
import ModalCatalog from "@/components/ModalCatalog"
import {
  FaCloudDownloadAlt,
  FaImage,
  FaSave,
  FaTimes,
  FaWindowClose,
} from "react-icons/fa"
import ModalDialog from "@/components/ModalDialog"

export default function addCategoryPage({ categories }) {
  const {
    user: { isAdmin, token },
  } = useContext(AuthContext)
  const [values, setValues] = useState({
    name: "",
    parent: "",
    parentId: null,
    description: "",
    options: {},
  })

  const [image, setImage] = useState({ path: "", file: null })
  const [price, setPrice] = useState({ path: "", file: null })
  const [catalog, setCatalog] = useState({ path: "", file: null })
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [showPriceUpload, setShowPriceUpload] = useState(false)
  const [showCatalogUpload, setShowCatalogUpload] = useState(false)

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
    formData.append("image", image.file)
    formData.append("price", price.file)
    formData.append("catalog", catalog.file)
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
    setShowImageUpload(false)
  }
  const handleUploadPrice = (e) => {
    setPrice({ path: "/", file: e.target.files[0] })
    setShowPriceUpload(false)
  }
  const handleUploadCatalog = (e) => {
    setCatalog({ path: "/", file: e.target.files[0] })
    setShowCatalogUpload(false)
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
      <Layout title="Добавление категории">
        {!isAdmin ? (
          <AccessDenied />
        ) : (
          <>
            <div className={styles.form}>
              <form onSubmit={handleSubmit}>
                <div className={styles.header}>
                  <Links home={true} back={true} />

                  <div className={styles.right_icons}>
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
                      <FaTimes
                        onClick={() =>
                          setValues({
                            ...values,
                            parent: "",
                            parentId: null,
                          })
                        }
                      />
                      <ul className={styles.dropdown_menu}>
                        {listForMenu && (
                          <>
                            {listForMenu.map((item, i) => (
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
                <div className={styles.image_header}>
                  <p>Изображение категории</p>
                  {values.parentId === null ? (
                    <div>
                      <div>
                        <FaCloudDownloadAlt
                          onClick={() => {
                            setShowPriceUpload(true)
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
                            setShowCatalogUpload(true)
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
                        setShowImageUpload(true)
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
          </>
        )}
        {showPriceUpload ? (
          <ModalDialog>
            <ModalPrice
              setShowPriceUpload={setShowPriceUpload}
              handleUploadPrice={handleUploadPrice}
            />
          </ModalDialog>
        ) : null}

        {showCatalogUpload ? (
          <ModalDialog>
            <ModalCatalog
              setShowCatalogUpload={setShowCatalogUpload}
              handleUploadCatalog={handleUploadCatalog}
            />
          </ModalDialog>
        ) : null}

        {showImageUpload ? (
          <ModalDialog>
            <ModalImage
              handleUploadChange={handleUploadChange}
              setShowImageUpload={setShowImageUpload}
            />
          </ModalDialog>
        ) : null}
      </Layout>
    </div>
  )
}

export async function getServerSideProps() {
  const data = await fetch(`${API_URL}/api/categories`)
  const { categories } = await data.json()
  if (!data || !categories) {
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
