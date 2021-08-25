import Layout from "@/components/Layout"
import AuthContext from "@/context/AuthContext"
import { useContext, useState } from "react"
import { API_URL, NOIMAGE_PATH } from "../../config/index"
import styles from "@/styles/brandForm.module.css"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import { FaImage, FaTimes } from "react-icons/fa"
import ImageUpload from "@/components/ImageUpload"
import Modal from "@/components/Modal"
import { useRouter } from "next/router"
import Link from "next/link"

export default function edit_brandPage({brands,slug}) {
  const {
    user: { isAdmin },
  } = useContext(AuthContext)
const brand=brands.find((item)=>item.slug===slug)
  const { name, colors, sizes, heights, _id } = brand
  const imagePath=brand.image
  const router = useRouter()

  const [inputValues, setInputValues] = useState({
    name: name,
    color: "",
    size: "",
    height: "",
  })

  const [values, setValues] = useState({
    name ,
    colors,
    sizes,
    heights,
    _id
  })
const [image,setImage]=useState({file:null,path:imagePath?`${API_URL}${imagePath}`:''})
  const [listName, setListName] = useState("")
  
  const [showModal, setShowModal] = useState(false)

  const listNameRu = { colors: "Цвета", sizes: "Размеры", heights: "Роста" }
  

  const handleChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    setInputValues({ ...inputValues, [name]: value })
    if (name === "name") {
      setValues({ ...values, name: value })
    }
  }
  const handlePress = (e, { name }) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleClick({ name, itemName: e.target.name })
    }
  }
  const handleClick = ({ name, itemName }) => {
    if (inputValues[itemName]) {
      setValues({
        ...values,
        [name]: [...values[name], { name: inputValues[itemName], price: 0 }],
      })
      setInputValues({ ...inputValues, [itemName]: "" })
    }

    const elem = document.getElementById(itemName)
    elem.focus()
  }

  const deleteImage = () => {
    URL.revokeObjectURL(image.path)
    setImage({ path: "", image: null })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!inputValues.name) {
      toast.error("Поле Название должно быть заполнено")
      return
    }
    // Send data
    const formData = new FormData()    
    formData.append('values',JSON.stringify(values))
    formData.append('imageClientPath',image.path)
    formData.append(`image`, image.file)

    const res = await fetch(`${API_URL}/api/brands`, {
      method: "PUT",
      headers: {
        enctype: "multipart/form-data",
      },
      body: formData,
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
              <h2>Редактирование бренда</h2>
              <button className="btn" type="submit">
                Сохранить
              </button>
            </div>
            <Link href="/">Вернуться на главную</Link>
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
                    onFocus={() => setListName("")}
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
                    onKeyPress={(e) => handlePress(e, { name: "colors" })}
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
                    onKeyPress={(e) => handlePress(e, { name: "sizes" })}
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
                    onKeyPress={(e) => handlePress(e, { name: "heights" })}
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
                    {image.path ? (
                      <div className={styles.image}>
                        <img
                          src={image.path}
                          
                        />
                      </div>
                    ) : (
                      <div className={styles.image}>
                        <img
                          src='/noimage.png'
                          
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
                        onClick={deleteImage}
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
                        {item.name}

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
          >
            <ImageUpload setShowModal={setShowModal} image={image} setImage={setImage} />
          </Modal>
        </div>
      ) : (
        <h2>У вас нет прав для редактирования этой страницы</h2>
      )}
    </Layout>
  )
}

export async function getServerSideProps({ params: { slug } }) {
  const res = await fetch(`${API_URL}/api/brands`)
  const { brands } = await res.json()

  if (!res.ok) {
    return {
      redirect: "/serverError",
    }
  }

  return {
    props: {
      brands,
      slug,
    },
  }
}
