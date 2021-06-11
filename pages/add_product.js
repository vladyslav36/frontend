import styles from "@/styles/Form.module.css"
import AccessDenied from "@/components/AccessDenied"
import Layout from "@/components/Layout"
import Modal from "@/components/Modal"
import ImageUpload from "@/components/ImageUpload"
import AuthContext from "@/context/AuthContext"
import {  
  useContext,  
  useEffect,  
  useState,
} from "react"
import { ToastContainer, toast } from "react-toastify"
import { FaImage, FaPlus, FaTimes } from "react-icons/fa"
import { useRouter } from "next/router"
import Link from "next/link"
import Image from "next/image"
import { API_URL, NOIMAGE_PATH } from "@/config/index"
import "react-toastify/dist/ReactToastify.css"
import { getCategoriesTree } from "../utils"

export default function addProductPage({ categories }) {
  const {
    user: { isAdmin },
  } = useContext(AuthContext)
  const [values, setValues] = useState({
    name: "",
    model: "",
    image: "",
    uploadedImage: "",
    uploadedImages: [],
    description: "",
    category: "",
    categorySlug: "",
    price: "",
    retailPrice: "",
    countInStock: 100,
    isShowCase: false,
    addedImages: [],
    currencyValue: "UAH",
  })
  const [imagePreview, setImagePreview] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [isShowList, setIsShowList] = useState(false)
  const [listForMenu, setListForMenu] = useState(getListForMenu(categories, ""))
  const [upploadCb, setUpploadCb] = useState({})
  const [imagesPreview, setImagesPreview] = useState([])
  const [imageIdx, setImageIdx] = useState(0)

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
    const hasEmptyFields = !values.name.trim() || !values.model.trim()
    if (hasEmptyFields) {
      toast.error("Поле Название и Модель должны быть заполнены")
      return
    }
    // Проверка на наличие и соответствие родительской категории в категориях
    if (values.category) {
      const isValid = categories.some(
        (item) =>
          item.name === values.category && item.slug === values.categorySlug
      )
      if (!isValid) {
        toast.error("Родительская категория должна быть выбрана из списка")
        return
      }
    } else {
      values.categorySlug = ""
    }

    // Send data
    const res = await fetch(`${API_URL}/api/products`, {
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
  // input для name & model ...
  const handleChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target

    setValues({ ...values, [name]: value })
  }
  // input for parentCategory
  const handleChangeCategory = (e) => {
    e.preventDefault()
    const { name, value } = e.target

    setValues({ ...values, [name]: value })
    setIsShowList(true)
    setListForMenu(getListForMenu(categories, value))
  }

  const handleListClick = ({ slug, name }) => {
    setValues({ ...values, category: name, categorySlug: slug })
  }

  const handleShowList = () => {
    setIsShowList(!isShowList)
  }
  const imageUpploaded = (path) => {
    setShowModal(false)
    setImagePreview(path)
    setValues({ ...values, uploadedImage: path })
  }

  const imagesUpploaded = (path, index) => {
    setShowModal(false)
    setImagesPreview(
      imagesPreview.map((item, i) => (i === index ? path : item))
    )    
  }

  const imagesNewUpploaded = (path) => {
    setShowModal(false)
    setImagesPreview([...imagesPreview, path])    
  }
  
  useEffect(() => {
  setValues({ ...values, uploadedImages: [...imagesPreview] })
  }, [imagesPreview])
  
  return (
    <Layout title="Добавление товара">
      {!isAdmin ? (
        <AccessDenied />
      ) : (
        <>
          <h1>Добавление товара</h1>
          <Link href="/">На главную</Link>
          <ToastContainer />
          <div className={styles.form}>
            <form onSubmit={handleSubmit}>
              <div className={styles.grid}>
                <div>
                  <label htmlFor="name">Название</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="model">Модель</label>
                  <input
                    type="text"
                    id="model"
                    name="model"
                    value={values.model}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="category">Категория</label>
                  <div className={styles.input_group_menu}>
                    <input
                      type="text"
                      id="category"
                      name="category"
                      value={values.category}
                      onChange={handleChangeCategory}
                      onClick={handleShowList}
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
                                  slug: category.slug,
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

                <div>
                  <div className={styles.labels}>
                    <label htmlFor="price">Цена (опт)</label>
                    <label htmlFor="retailPrice">Цена (розн)</label>
                    <label htmlFor="currencyValue">Валюта товара</label>
                  </div>
                  <div className={styles.input_price}>
                    <div>
                      <input
                        type="text"
                        id="price"
                        name="price"
                        value={values.price}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        id="retailPrice"
                        name="retailPrice"
                        value={values.retailPrice}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <select
                        className={styles.input}
                        name="currencyValue"
                        id="currencyValue"
                        value={values.currencyValue}
                        onChange={handleChange}
                      >
                        <option value="UAH">UAH</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="countInStock">Остаток в магазине</label>
                  <input
                    type="number"
                    id="countInStock"
                    name="countInStock"
                    value={values.countInStock}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <div>
                    <label htmlFor="isShowCase">Показывать на витрине</label>
                  </div>
                  <div>
                    <select
                      id="isShowCase"
                      name="isShowCase"
                      value={values.isShowCase}
                      onChange={handleChange}
                    >
                      <option value="false">Нет</option>
                      <option value="true">Да</option>
                    </select>
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
              <input type="submit" value="Добавить товар" className="btn" />
            </form>
          </div>
          <h2>Основное изображение</h2>
          <div className={styles.image_container}>
            <div className={styles.image}>
              {imagePreview ? (
                <Image
                  src={`${API_URL}${imagePreview}`}
                  width={200}
                  height={250}
                />
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
            </div>
            <div className={styles.image_footer}>
              <button
                className="btn"
                onClick={() => {
                  setShowModal(true)
                  setIsShowList(false)
                  setUpploadCb({ cb: imageUpploaded })
                }}
              >
                <FaImage />
              </button>
              <button
                className="btn"
                onClick={() => {
                  setImagePreview("")
                }}
              >
                <FaTimes />
              </button>
            </div>
          </div>
          <h2>Дополнительные изображения</h2>
          <div className={styles.images_container}>
            {imagesPreview.length
              ? imagesPreview.map((item, i) => (
                  <div key={i} className={styles.image_container}>
                    <div className={styles.image}>
                      <Image
                        src={`${API_URL}${item}`}
                        width={200}
                        height={250}
                      />
                    </div>
                    <div className={styles.image_footer}>
                      <button
                        className="btn"
                        onClick={() => {
                          setImageIdx(i)
                          setShowModal(true)
                          setIsShowList(false)
                          setUpploadCb({ cb: imagesUpploaded })
                        }}
                      >
                        <FaImage />
                      </button>
                      <button
                        className="btn"
                        onClick={() => {
                          setImagesPreview(
                            imagesPreview.filter((item, index) => index !== i)
                          )
                        }}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                ))
              : null}
            <button
              className="btn"
              onClick={() => {
                setShowModal(true)
                setIsShowList(false)
                setUpploadCb({ cb: imagesNewUpploaded })
              }}
            >
              <FaPlus />
            </button>
          </div>
        </>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <ImageUpload imageUploaded={upploadCb.cb} index={imageIdx} />
      </Modal>
    </Layout>
  )
}

export async function getServerSideProps() {
  const data = await fetch(`${API_URL}/api/categories`)
  const { categories } = await data.json()
  return {
    props: {
      categories,
    },
  }
}
