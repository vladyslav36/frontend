import styles from "@/styles/Form.module.css"
import AccessDenied from "@/components/AccessDenied"
import Layout from "@/components/Layout"
import Modal from "@/components/Modal"
import ImagesUpload from "@/components/ImagesUpload"
import AuthContext from "@/context/AuthContext"
import { useContext, useEffect, useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FaImage, FaPlus, FaTimes } from "react-icons/fa"
import { useRouter } from "next/router"
import Link from "next/link"
import { API_URL } from "@/config/index"
import { getCategoriesTree, stringToPrice } from "../utils"
import SelectOptions from "@/components/SelectOptions"
import Links from "@/components/Links"

export default function addProductPage({ categories, brands }) {
  const {
    user: { isAdmin,token },
  } = useContext(AuthContext)
  const [values, setValues] = useState({
    name: "",
    model: "",
    brand: "",
    brandId: null,
    description: "",
    category: "",
    categoryId: null,
    colors: [],
    sizes: [],
    heights: [],
    isInStock: true,
    price: "",
    retailPrice: "",
    isShowcase: false,
    currencyValue: "UAH",
  })

  const [images, setImages] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [isShowList, setIsShowList] = useState(false)
  const [isShowBrandsList, setIsShowBrandsList] = useState(false)
  const [listForMenu, setListForMenu] = useState(getListForMenu(categories, ""))
  const [listForBrandsMenu, setListForBrandsMenu] = useState(
    getListForMenu(brands, "")
  )
  const [upploadCb, setUpploadCb] = useState({})

  const [imageIdx, setImageIdx] = useState(0)

  const router = useRouter()
  // Функция возвращает список категорий или брендов в соответствии со строкой поиска
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
    // Проверка на наличие и соответствии бренда в брендах
    if (values.brand) {
      const isValid = brands.some(
        (item) => item.name === values.brand && item._id === values.brandId
      )
      if (!isValid) {
        toast.error("Бренд должен  быть выбран из списка")
        return
      }
    } else {
      values.brandId = null
    }
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
  // Input for brands
  const handleChangeBrand = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    setValues({ ...values, [name]: value })
    setIsShowBrandsList(true)
    setListForBrandsMenu(getListForMenu(brands, value))
  }

  const handleListClick = ({ name, id }) => {
    setValues({ ...values, category: name, categoryId: id })
    setIsShowList(false)
  }
  const handleListBrandClick = ({ name, id }) => {
    setValues({ ...values, brand: name, brandId: id })
    setIsShowBrandsList(false)
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
                  <label htmlFor="brand">Бренд</label>
                  <div
                    className={styles.input_group_menu}
                    tabIndex={0}
                    onFocus={() => setIsShowBrandsList(true)}
                    onBlur={() => setIsShowBrandsList(false)}
                  >
                    <input
                      type="text"
                      id="brand"
                      name="brand"
                      value={values.brand}
                      onChange={handleChangeBrand}
                    />

                    <ul
                      className={
                        styles.dropdown_menu +
                        " " +
                        (isShowBrandsList && styles.active)
                      }
                    >
                      {listForBrandsMenu && (
                        <>
                          {listForBrandsMenu.map((brand) => (
                            <li
                              key={brand._id}
                              onClick={() =>
                                handleListBrandClick({
                                  id: brand._id,
                                  name: brand.name,
                                })
                              }
                            >
                              {brand.name}
                            </li>
                          ))}
                        </>
                      )}
                    </ul>
                  </div>
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
                              onClick={() =>
                                handleListClick({
                                  name: category.name,
                                  id: category._id,
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
                  <div className={styles.checkbox}>
                    <label htmlFor="isShowcase">Показывать на витрине</label>
                    <input
                      type="checkbox"
                      name="isShowcase"
                      id="isShowcase"
                      onChange={handleChange}
                      checked={values.isShowcase}
                    />
                  </div>

                  <div className={styles.checkbox}>
                    <label htmlFor="isInStock">В наличии</label>
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
              {values.brand && (
                <SelectOptions
                  brandId={values.brandId}
                  brands={brands}
                  values={values}
                  setValues={setValues}
                  toast={toast}
                />
              )}
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
  const brandsData = await fetch(`${API_URL}/api/brands`)
  const { brands } = await brandsData.json()
  return {
    props: {
      categories,
      brands,
    },
  }
}
