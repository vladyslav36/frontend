import styles from "@/styles/Form.module.scss"
import AccessDenied from "@/components/AccessDenied"
import Layout from "@/components/Layout"
import AuthContext from "@/context/AuthContext"
import { useContext, useState, useEffect, useRef } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { GiCheckMark } from "react-icons/gi"
import { useRouter } from "next/router"
import { API_URL } from "@/config/index"
import {
  getBrand,
  getListForCatalogsMenu,
  getListForCategoriesMenu,
  stringToPrice,
} from "../utils"
import SelectOptions from "@/components/SelectOptions"
import Links from "@/components/Links"
import ModalImage from "@/components/ModalImage"
import BcOptions from "@/components/BcOptions"
import {
  FaCloudDownloadAlt,
  FaPlusSquare,
  FaSave,
  FaTimes,
  FaWindowClose,
} from "react-icons/fa"
import BcAlong from "@/components/BcAlong"

export default function addProductPage({ categories, catalogs,barcods }) {
  const {
    user: { isAdmin, token },
  } = useContext(AuthContext)

  const [values, setValues] = useState({
    name: "",
    brandId: null,
    model: "",
    description: "",
    categoryId: null,
    catalogId: null,
    options: {},
    barcods: {},
    barcode: "",
    isInStock: true,
    price: "",
    retailPrice: "",
    isShowcase: false,
    currencyValue: "UAH",
  })

  const [images, setImages] = useState([])
  const [brand, setBrand] = useState({})
  const listForCategoryMenu = getListForCategoriesMenu(categories)
  const listForCatalogMenu = getListForCatalogsMenu(catalogs)
  const [catalogName, setCatalogName] = useState("")
  const [categoryName, setCategoryName] = useState("")
  const [isBcWithOptions, setIsBcWithOptions] = useState(false)

  const [imageIdx, setImageIdx] = useState(0)

  const elDialog = useRef()
  const router = useRouter()

  useEffect(() => {
    const rez = Object.keys(values.options).length
      ? Object.keys(values.options).some(
          (option) => Object.keys(values.options[option]).length
        )
      : false
   
    setIsBcWithOptions(rez)
  }, [values.options])

  const resetCategory = () => {
    setCategoryName("")
    setValues({ ...values, categoryId: null, brandId: null, options: {} })
    setBrand({})
  }

  const resetCatalog = () => {
    setCatalogName("")
    setValues({ ...values, catalogId: null })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Проверка на заполнение поля имени и модели товара
    const hasEmptyFields = !values.name.trim() || !values.model.trim()
    if (hasEmptyFields) {
      toast.error("Поле Название и Модель должны быть заполнены")
      return
    }

    if (!categoryName) {
      toast.error("Поле категория является обязательным")
      return
    }

    if (values.categoryId === values.brandId) {
      toast.error("Товар должен находиться хотя бы в одной подкатегории")
      return
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

 
  // input для name & model ...
  const handleChange = (e) => {
    const { name, value, checked } = e.target
    if (name === "isShowcase" || name === "isInStock") {
      setValues({ ...values, [name]: checked })
    } else {
      e.preventDefault()
      if (name === "catalog") {
        toast.warning("Каталог выбирается из выпадающего списка")
        return
      }
      if (name === "category") {
        toast.warning("Категория выбирается из выпадающего списка")
        return
      }
      setValues({ ...values, [name]: value })
    }
  }

  const handleListClick = async (category) => {
    const brand = getBrand(category, categories)
    setBrand(brand)
    setCategoryName(category.name)
    setValues({
      ...values,
      categoryId: category._id,
      brandId: brand._id,
      options: Object.assign(
        {},
        ...Object.keys(brand.options).map((option) => ({ [option]: {} }))
      ),
    })
  }
  const handleUploadChange = (e) => {
    const url = URL.createObjectURL(e.target.files[0])
    // что нажато: добавление новой картинки или изменение существующей
    if (images[imageIdx]) {
      URL.revokeObjectURL(images[imageIdx].path)
      setImages(
        images.map((item, i) =>
          i === imageIdx ? { path: url, file: e.target.files[0] } : item
        )
      )
    } else {
      setImages([...images, { path: url, file: e.target.files[0] }])
    }
    elDialog.current.close()
  }
  const deleteImage = (i) => {
    URL.revokeObjectURL(images[i].path)
    setImages(images.filter((item, idx) => idx !== i))
  }
console.log(barcods)
  return (
    <Layout title="Добавление товара">
      {!isAdmin ? (
        <AccessDenied />
      ) : (
        <div>
          <div className={styles.form}>
            <form>
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
                      value={categoryName}
                      onChange={handleChange}
                    />
                    <div className={styles.cancell} onClick={resetCategory}>
                      <FaTimes />
                    </div>

                    <ul className={styles.dropdown_menu}>
                      {listForCategoryMenu && (
                        <>
                          {listForCategoryMenu.map((item, i) => (
                            <li
                              key={i}
                              onClick={() => handleListClick(item.cat)}
                            >
                              {item.tree}
                            </li>
                          ))}
                        </>
                      )}
                    </ul>
                  </div>
                </div>
                <div>
                  <label htmlFor="catalog">Каталог</label>
                  <div className={styles.input_group_menu}>
                    <input
                      type="text"
                      id="catalog"
                      name="catalog"
                      value={catalogName}
                      onChange={handleChange}
                    />
                    <div className={styles.cancell} onClick={resetCatalog}>
                      <FaTimes />
                    </div>

                    <ul className={styles.dropdown_menu}>
                      {listForCatalogMenu && (
                        <>
                          {listForCatalogMenu.map((item, i) => (
                            <li
                              key={i}
                              onClick={() => {
                                setValues({
                                  ...values,
                                  catalog: item.cat.name,
                                  catalogId: item.cat._id,
                                })
                                setCatalogName(item.cat.name)
                              }}
                            >
                              {item.tree}
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
                        onChange={(e) =>
                          setValues({
                            ...values,
                            price: e.target.value
                              .replace(/[^\d.,]+/g, "")
                              .replace(",", "."),
                          })
                        }
                        onBlur={(e) =>
                          setValues({
                            ...values,
                            price: stringToPrice(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div tabIndex={0}>
                      <input
                        type="text"
                        id="retailPrice"
                        name="retailPrice"
                        value={values.retailPrice}
                        onChange={(e) =>
                          setValues({
                            ...values,
                            retailPrice: e.target.value
                              .replace(/[^\d.,]+/g, "")
                              .replace(",", "."),
                          })
                        }
                        onBlur={(e) =>
                          setValues({
                            ...values,
                            retailPrice: stringToPrice(e.target.value),
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
                    <input
                      type="checkbox"
                      name="isShowcase"
                      id="isShowcase"
                      onChange={handleChange}
                      checked={values.isShowcase}
                    />
                    <label htmlFor="isShowcase">Показывать на витрине </label>

                    <GiCheckMark className={styles.check_icon} />
                  </div>

                  <div className={styles.custom_checkbox}>
                    <input
                      type="checkbox"
                      name="isInStock"
                      id="isInStock"
                      onChange={handleChange}
                      checked={values.isInStock}
                    />
                    <label htmlFor="isInStock">В наличии</label>
                    <GiCheckMark className={styles.check_icon} />
                  </div>
                </div>
              </div>
              {Object.keys(brand).length &&
              Object.keys(brand.options).length ? (
                <SelectOptions
                  values={values}
                  setValues={setValues}
                  brand={brand}
                  toast={toast}
                />
              ) : null}
              {isBcWithOptions ? (
                  <BcOptions values={values} setValues={setValues} token={token } />
              ) : (
                    <BcAlong values={values} setValues={setValues} token={ token} />
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
            <h2>Изображения</h2>
            <div className={styles.images_container}>
              {images.length
                ? images.map((item, i) => (
                    <div className={styles.image_container} key={i}>
                      <div className={styles.image}>
                        <img src={item.path} />
                      </div>
                      <div className={styles.image_footer}>
                        <FaCloudDownloadAlt
                          className={styles.icon}
                          name="download"
                          title="Загрузить"
                          onClick={() => {
                            setImageIdx(i)
                            elDialog.current.showModal()
                          }}
                        />
                        <FaWindowClose
                          className={styles.icon}
                          name="delete"
                          title="Удалить"
                          onClick={() => deleteImage(i)}
                        />
                      </div>
                    </div>
                  ))
                : null}
              <FaPlusSquare
                className={styles.plus_icon}
                onClick={() => {
                  setImageIdx(images.length)
                  elDialog.current.showModal()
                }}
              />
            </div>
          </div>
        </div>
      )}
      <ModalImage handleUploadChange={handleUploadChange} elDialog={elDialog} />
    </Layout>
  )
}

export async function getServerSideProps() {

  const res1 = await fetch(`${API_URL}/api/categories`)
  const res2 = await fetch(`${API_URL}/api/catalogs`)
  const res3 = await fetch(`${API_URL}/api/barcode`)
  const [{ categories }, { catalogs }, { barcods }] = await Promise.all([res1.json(), res2.json(), res3.json()]) 

  if (!res1.ok || !categories || !res2.ok || !catalogs||!res3.ok||!barcods ) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      categories,
      catalogs,
      barcods
    },
  }
}
