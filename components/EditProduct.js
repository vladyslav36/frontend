import styles from "@/styles/Form.module.scss"
import { useEffect, useRef, useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import { API_URL } from "@/config/index"
import "react-toastify/dist/ReactToastify.css"
import {
  getBrand,
  getListForCatalogsMenu,
  getListForCategoriesMenu,
  idToString,
  stringToPrice,
} from "../utils"
import SelectOptions from "@/components/SelectOptions"
import Links from "@/components/Links"
import { GiCheckMark } from "react-icons/gi"
import ModalImage from "./ModalImage"

export default function EditProduct({
  setProdList,
  prodList,
  categories,
  catalogs,
  product,
  setIsShowProduct,
  token,
}) {
  const brandOptions = categories.find(
    (item) => idToString(item._id) === idToString(product.brandId)
  ).options
  const categoryName = categories.find(
    (item) => idToString(item._id) === idToString(product.categoryId)
  ).name
  const catalogName = product.catalogId
    ? catalogs.find(
        (item) => idToString(item._id) === idToString(product.catalogId)
      ).name
    : ""

  const [values, setValues] = useState({
    _id: product._id,
    name: product.name,
    brandId: product.brandId,
    model: product.model,
    description: product.description,
    category: categoryName,
    catalog: catalogName,
    categoryId: product.categoryId,
    catalogId: product.catalogId,
    options: Object.keys(product.options).length
      ? product.options
      : brandOptions,
    isInStock: product.isInStock,
    price: product.price,
    retailPrice: product.retailPrice,
    isShowcase: product.isShowcase,
    currencyValue: product.currencyValue,
  })

  const [images, setImages] = useState(
    product.images.map((item) => {
      return { file: null, path: `${API_URL}${item}` }
    })
  )

  const listForCategoryMenu = getListForCategoriesMenu(categories)
  const listForCatalogMenu = getListForCatalogsMenu(catalogs)

  const [imageIdx, setImageIdx] = useState(0)
  const elDialog = useRef()

  useEffect(() => {
    if (!values.categoryId)
      setValues({ ...values, options: {}, category: "", brandId: null })
  }, [values.categoryId])

  useEffect(() => {
    if (!values.catalogId) setValues({ ...values, catalog: "" })
  }, [values.catalogId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Проверка на заполнение поля имени категории
    const hasEmptyFields = !values.name.trim() || !values.model.trim()
    if (hasEmptyFields) {
      toast.error("Поле Название и Модель должны быть заполнены")
      return
    }

    // Send data
    const formData = new FormData()
    formData.append("values", JSON.stringify(values))
    const imageClientPaths = images.map((item) => item.path)
    formData.append("imageClientPaths", JSON.stringify(imageClientPaths))
    images.forEach((item) => formData.append("images", item.file))
    const res = await fetch(`${API_URL}/api/products`, {
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
      setProdList(
        prodList.map((item) =>
          item._id != data.product._id ? item : data.product
        )
      )
      setIsShowProduct(false)
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
    setValues({
      ...values,
      category: category.name,
      categoryId: category._id,
      brandId: brand._id,
      options: { ...brand.options },
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

  return (
    <>
      <div className={styles.form}>
        <form>
          <div className={styles.header}>
            <Links home={true} back={true} />

            <span>
              <i
                className="fa-solid fa-square-xmark fa-2xl"
                title="Отмена"
                name="cancel"
                onClick={() => setIsShowProduct(false)}
              ></i>
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
                  onChange={handleChange}
                />
                <div
                  className={styles.cancell}
                  onClick={() => setValues({ ...values, categoryId: null })}
                >
                  <i className="fa-solid fa-xmark fa-lg"></i>
                </div>
                <ul className={styles.dropdown_menu}>
                  {listForCategoryMenu && (
                    <>
                      {listForCategoryMenu.map((item) => (
                        <li
                          key={item.cat._id}
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
                  value={values.catalog}
                  onChange={handleChange}
                />
                <div
                  className={styles.cancell}
                  onClick={() => setValues({ ...values, catalogId: null })}
                >
                  <i className="fa-solid fa-xmark fa-lg"></i>
                </div>

                <ul className={styles.dropdown_menu}>
                  {listForCatalogMenu && (
                    <>
                      {listForCatalogMenu.map((item) => (
                        <li
                          key={item.cat._id}
                          onClick={() =>
                            setValues({
                              ...values,
                              catalog: item.cat.name,
                              catalogId: item.cat._id,
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
                 <input
                  type="checkbox"
                  name="isShowcase"
                  id="isShowcase"
                  onChange={handleChange}
                  checked={values.isShowcase}
                />
                <label htmlFor="isShowcase">Показывать на витрине</label>
                <GiCheckMark
                  className={
                    styles.check_icon 
                  }
                />
               
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
                <GiCheckMark
                  className={
                    styles.check_icon 
                  }
                />
                
              </div>
            </div>
          </div>
          {Object.keys(values.options).length ? (
            <SelectOptions
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
                        elDialog.current.showModal()
                      }}
                    >
                      <i className="fa-regular fa-image"></i>
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteImage(i)}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                </div>
              ))
            : null}
          <button
            className="btn"
            onClick={() => {
              setImageIdx(images.length)
              elDialog.current.showModal()
            }}
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>
      <ModalImage handleUploadChange={handleUploadChange} elDialog={elDialog} />
    </>
  )
}
