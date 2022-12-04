import styles from "@/styles/Form.module.scss"
import AccessDenied from "@/components/AccessDenied"
import Layout from "@/components/Layout"
import AuthContext from "@/context/AuthContext"
import { useContext, useState, useEffect, useRef } from "react"
import { ToastContainer, toast } from "react-toastify"
import { useRouter } from "next/router"
import { API_URL, NOIMAGE } from "@/config/index"
import "react-toastify/dist/ReactToastify.css"
import Links from "@/components/Links"
import Options from "@/components/Options"
import { getListForCategoriesMenu } from "../utils"
import ModalImage from "@/components/ModalImage"

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
  const elDialog = useRef()

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
      if (!Object.keys(values.options[option].values).length) {
        toast.warning("Опция введена без значений")
        error = true
      }
    })
    if (error) return

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

                  <span>
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
                        <i className="fa-solid fa-xmark fa-lg"></i>
                      </div>
                      <ul className={styles.dropdown_menu}>
                        {listForMenu && (
                          <>
                            {listForMenu.map((item) => (
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
                      <img src={`${NOIMAGE}`}/>
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
              {!values.parent ? (
                <Options values={values} setValues={setValues} />
              ) : null}
            </div>
          </>
        )}
        <ModalImage
          elDialog={elDialog}
          handleUploadChange={handleUploadChange}
        />
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
