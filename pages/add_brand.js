import Layout from "@/components/Layout"
import AuthContext from "@/context/AuthContext"
import { useContext, useState } from "react"
import { API_URL, NOIMAGE_PATH } from "../config"
import styles from "@/styles/brandForm.module.css"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Image from "next/image"
import { FaImage, FaTimes } from "react-icons/fa"
import ImageUpload from "@/components/ImageUpload"
import Modal from "@/components/Modal"
import { useRouter } from "next/router"

export default function add_brandPage() {
  const {
    user: { isAdmin },
  } = useContext(AuthContext)

  const router = useRouter()

  const [inputValues, setInputValues] = useState({
    name: "",
    color: "",
    size: "",
    height: "",
  })

  const [values, setValues] = useState({
    name: "",
    colors: [],
    sizes: [],
    heights: [],
    uploadedImage: "",
    image: "",
  })

  const [listName, setListName] = useState("")
  const [imagePreview, setImagePreview] = useState("")
  const [showModal, setShowModal] = useState(false)

  const listNameRu = { colors: "Цвета", sizes: "Размеры", heights: "Роста" }

  const imageUploaded = (path) => {
    setShowModal(false)
    setImagePreview(path)
    setValues({ ...values, uploadedImage: path })
  }

  const handleChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    setInputValues({ ...inputValues, [name]: value })
    if (name === "name") {
      setValues({ ...values, name: value })
    }
  }
  const handlePress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
    }
  }
  const handleClick = ({ name, itemName }) => {
    
    if (inputValues[itemName]) {
      setValues({ ...values, [name]: [...values[name], inputValues[itemName]] })
      setInputValues({ ...inputValues, [itemName]: "" })
    }

    const elem = document.getElementById(itemName)
    elem.focus()
  }

  
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!inputValues.name) {
      toast.error("Поле Название должно быть заполнено")
    }
    // Send data
    const res = await fetch(`${API_URL}/api/brands`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
    const data = await res.json()

    if (!res.ok) {
      toast.error("Что-то пошло не так")
    } else {
      router.push("/")
    }
  }

  return (
    <Layout title="Добавление бренда">
      {isAdmin ? (
        <div>
          <ToastContainer />

          <form onSubmit={handleSubmit}>
            <div className={styles.header}>
              <h2>Добавление бренда</h2>
              <button className="btn" type="submit">
                Сохранить
              </button>
            </div>
            <div className={styles.content}>
              <div className={styles.input_field}>
                <div className={styles.input_block}>
                  <div>
                    <label htmlFor="name">Название</label>
                  </div>
                  <input
                    className={styles.input}
                    type="text"
                    id="name"
                    name="name"
                    value={inputValues.name}
                    onChange={handleChange}
                    onKeyPress={handlePress}
                    onFocus={()=>setListName('')}
                  />
                </div>

                <div className={styles.input_block}>
                  <div>
                    <label htmlFor="color">Добавить цвет</label>
                  </div>
                  <input
                    className={styles.input}
                    type="text"
                    name="color"
                    id="color"
                    value={inputValues.color}
                    onChange={handleChange}
                    onKeyPress={handlePress}
                    onFocus={() => setListName("colors")}
                    
                  />
                  <input
                    className={styles.button}
                    onClick={() =>
                      handleClick({ itemName: "color", name: "colors" })
                    }
                    type="button"
                    value="Добавить"
                  />
                </div>
                <div className={styles.input_block}>
                  <div>
                    <label htmlFor="size">Добавить размер</label>
                  </div>
                  <input
                    className={styles.input}
                    type="text"
                    name="size"
                    id="size"
                    value={inputValues.size}
                    onChange={handleChange}
                    onKeyPress={handlePress}
                    onFocus={() => setListName("sizes")}
                    
                  />
                  <input
                    className={styles.button}
                    onClick={() =>
                      handleClick({ itemName: "size", name: "sizes" })
                    }
                    type="button"
                    value="Добавить"
                  />
                </div>
                <div className={styles.input_block}>
                  <div>
                    <label htmlFor="height">Добавить рост</label>
                  </div>
                  <input
                    className={styles.input}
                    type="text"
                    name="height"
                    id="height"
                    value={inputValues.height}
                    onChange={handleChange}
                    onKeyPress={handlePress}
                    onFocus={() => setListName("heights")}
                    
                  />
                  <input
                    className={styles.button}
                    onClick={() =>
                      handleClick({ itemName: "height", name: "heights" })
                    }
                    type="button"
                    value="Добавить"
                  />
                </div>
                <div>
                  <div className={styles.image_container}>
                    {imagePreview ? (
                      <div className={styles.image}>
                        <Image
                          src={`${API_URL}${imagePreview}`}
                          width={200}
                          height={250}
                        />
                      </div>
                    ) : (
                      <div className={styles.image}>
                        <Image
                          src={`${API_URL}${NOIMAGE_PATH}`}
                          width={200}
                          height={250}
                          alt="No Image"
                        />
                      </div>
                    )}
                    <div className={styles.image_footer}>
                      <button
                        type="button"
                        className="btn"
                        onClick={() => {
                          setShowModal(true)
                        }}
                      >
                        <FaImage />
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => {
                          setImagePreview("")
                        }}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.option_list}>
                <h4>{listNameRu[listName]}</h4>

                {listName ? (
                  <ul>
                    {values[listName].map((item, i) => (
                      <li key={i}>
                        {item}

                        <FaTimes
                          className={styles.icon}
                          onClick={() =>
                            setValues({
                              ...values,
                              [listName]: [
                                ...values[listName].filter(
                                  (item, idx) => idx !== i
                                ),
                              ],
                            })
                          }
                        />
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </form>

          <Modal
            show={showModal}
            onClose={() => setShowModal(false)}
            title="Загрузить картинку"
          >
            <ImageUpload imageUploaded={imageUploaded} />
          </Modal>
        </div>
      ) : (
        <h2>У вас нет прав для редактирования этой страницы</h2>
      )}
    </Layout>
  )
}
