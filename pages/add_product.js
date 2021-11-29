import styles from "@/styles/Form.module.css"
import AccessDenied from "@/components/AccessDenied"
import Layout from "@/components/Layout"
import Modal from "@/components/Modal"
import ImagesUpload from "@/components/ImagesUpload"
import AuthContext from "@/context/AuthContext"
import { useContext, useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FaCheck, FaImage, FaPlus, FaTimes } from "react-icons/fa"
import { GiCheckMark } from "react-icons/gi"
import { useRouter } from "next/router"

import { API_URL } from "@/config/index"
import { getBrand, getCategoriesTree, stringToPrice } from "../utils"
import SelectOptions from "@/components/SelectOptions"
import Links from "@/components/Links"

export default function addProductPage({ categories }) {
  const {
    user: { isAdmin, token },
  } = useContext(AuthContext)

  const [values, setValues] = useState({
    name: "",
    brand:'',
    model: "",
    description: "",
    category: "",
    categoryId: null,
    options: [],
    isInStock: true,
    price: "",
    retailPrice: "",
    isShowcase: false,
    currencyValue: "UAH",
  })

  const [images, setImages] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [isShowList, setIsShowList] = useState(false)
  const [listForMenu, setListForMenu] = useState(getListForMenu(categories, ""))

  const [brandOptions, setBrandOptions] = useState({})

  const [imageIdx, setImageIdx] = useState(0)

  const router = useRouter()

  // Сортировка option перед отправкой на сервер
  const sortOptions = () => {
    setValues({
      ...values,
      options: values.options.map((option) => ({
        ...option,
        values: [...option.values.sort((a, b) => (a.name > b.name ? 1 : -1))],
      })),
    })
  }
  // Функция возвращает список категорий в соответствии со строкой поиска
  function getListForMenu(items, value) {
    const list = items.filter(
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
          item.name === values.category && item._id === values.categoryId
      )
      if (!isValid) {
        toast.error("Родительская категория должна быть выбрана из списка")
        return
      }
    } else {
      values.categoryId = null
    }

    sortOptions()

    // Send data
    const formData = new FormData()
    formData.append("values", JSON.stringify(values))
    images.forEach((item) => formData.append("images", item.file))
    const res = await fetch(`${API_URL}/api/products`, {
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

  const formatPrice = ({ name, value }) => {
    let { price, error } = stringToPrice(value)
    if (error) {
      price = ""
      toast.error("Прайс должен быть числом")
    }
    setValues({ ...values, [name]: price })
  }
  // input для name & model ...
  const handleChange = (e) => {
    const { name, value, checked } = e.target
    if (name === "isShowcase" || name === "isInStock") {
      setValues({ ...values, [name]: checked })
    } else {
      e.preventDefault()
      setValues({ ...values, [name]: value })
    }
  }


  // input for parentCategory
  const handleChangeCategory = (e) => {
    e.preventDefault()
    const { name, value } = e.target

    setValues({ ...values, [name]: value })
    setIsShowList(true)
    setListForMenu(getListForMenu(categories, value))
  }

  const handleListClick = async (category) => {
    const brand = getBrand(category, categories)
    
    setIsShowList(false)
    const res = await fetch(`${API_URL}/api/options/brandid/${brand._id}`)
    const { data } = await res.json()
    if (!res.ok || !data) {
      toast.info("Нет опций у бренда")
      setValues({
        ...values,
        category: category.name,
        categoryId: category._id,
        brand: brand.name,
      })
      setBrandOptions({})
      return
    }

    setValues({
      ...values,
      category: category.name,
      categoryId: category._id,
      brand: brand.name,
      options: data.options.map((item) => ({
        name: item.name,
        values: [],
        isChangePrice: false,
      })),
    })

    setBrandOptions(data)
  }

  const deleteImage = (i) => {
    URL.revokeObjectURL(images[i].path)
    setImages(images.filter((item, idx) => idx !== i))
  }
console.log(values)
  return (
    <Layout title="Добавление товара">
      {!isAdmin ? (
        <AccessDenied />
      ) : (
        <div className={styles.container}>
          <div className={styles.form}>
            <form onSubmit={handleSubmit}>
              <div className={styles.header}>
                <Links home={true} />
                <input type="submit" value="Сохранить" className="btn" />
              </div>

              <ToastContainer />
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
                  <div
                    className={styles.input_group_menu}
                    tabIndex={0}
                    onFocus={() => setIsShowList(true)}
                    onBlur={() => setIsShowList(false)}
                  >
                    <input
                      type="text"
                      id="category"
                      name="category"
                      value={values.category}
                      onChange={handleChangeCategory}
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
                              onClick={() => handleListClick(category)}
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
                    <div tabIndex={0}>
                      <input
                        type="text"
                        id="price"
                        name="price"
                        value={values.price}
                        onChange={handleChange}
                        onBlur={(e) =>
                          formatPrice({ name: "price", value: e.target.value })
                        }
                      />
                    </div>
                    <div tabIndex={0}>
                      <input
                        type="text"
                        id="retailPrice"
                        name="retailPrice"
                        value={values.retailPrice}
                        onChange={handleChange}
                        onBlur={(e) =>
                          formatPrice({
                            name: "retailPrice",
                            value: e.target.value,
                          })
                        }
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

                <div className={styles.checkbox_wrapper}>
                  <div className={styles.custom_checkbox}>
                    <label htmlFor="isShowcase">Показывать на витрине </label>

                    <GiCheckMark
                      className={
                        styles.check_icon +
                        " " +
                        (values.isShowcase ? styles.visible : "")
                      }
                    />

                    <input
                      type="checkbox"
                      name="isShowcase"
                      id="isShowcase"
                      onChange={handleChange}
                      checked={values.isShowcase}
                    />
                  </div>

                  <div className={styles.custom_checkbox}>
                    <label htmlFor="isInStock">В наличии</label>
                    <GiCheckMark
                      className={
                        styles.check_icon +
                        " " +
                        (values.isInStock ? styles.visible : "")
                      }
                    />

                    <input
                      type="checkbox"
                      name="isInStock"
                      id="isInStock"
                      onChange={handleChange}
                      checked={values.isInStock}
                    />
                  </div>
                </div>
              </div>
              {Object.keys(brandOptions).length ? (
                <SelectOptions
                  brandOptions={brandOptions}
                  values={values}
                  setValues={setValues}
                  toast={toast}
                />
              ) : null}
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
          </div>
          <h2>Изображения</h2>
          <div className={styles.images_container}>
            {images.length
              ? images.map((item, i) => (
                  <div className={styles.image_container} key={i}>
                    <div className={styles.image}>
                      <img src={item.path} />
                    </div>
                    <div className={styles.image_footer}>
                      <button
                        className="btn"
                        onClick={() => {
                          setImageIdx(i)
                          setShowModal(true)
                          setIsShowList(false)
                        }}
                      >
                        <FaImage />
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => deleteImage(i)}
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
                setImageIdx(images.length)
                setShowModal(true)
                setIsShowList(false)
              }}
            >
              <FaPlus />
            </button>
          </div>
        </div>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <ImagesUpload
          setShowModal={setShowModal}
          images={images}
          setImages={setImages}
          idx={imageIdx}
        />
      </Modal>
    </Layout>
  )
}

export async function getServerSideProps() {
  const categoriesData = await fetch(`${API_URL}/api/categories`)
  const { categories } = await categoriesData.json()

  return {
    props: {
      categories,
    },
  }
}
