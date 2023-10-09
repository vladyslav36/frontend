import styles from "@/styles/Form.module.scss"
import { useEffect,  useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import { API_URL } from "@/config/index"
import "react-toastify/dist/ReactToastify.css"
import {
  createPriceObject,
  getBrand,
  getListForCatalogsMenu,
  getListForCategoriesMenu,  
  idToString,  
} from "../utils"
import SelectOptions from "@/components/SelectOptions"
import Links from "@/components/Links"
import { GiCheckMark } from "react-icons/gi"
import ModalImage from "./ModalImage"
import { FaCloudDownloadAlt, FaPlusSquare, FaSave, FaTimes, FaWindowClose } from "react-icons/fa"

import ModalDialog from "./ModalDialog"
import PriceTable from "./PriceTable"

export default function EditProduct({
  setProdList,
  prodList,
  categories,
  catalogs,
  product,
  setIsShowProduct,  
  token,
}) {
 

  const [brand, setBrand] = useState(
    categories.find(
      (item) => idToString(item._id) === idToString(product.brandId)
    )
  )
  const [categoryName, setCategoryName] = useState(
    categories.find(
      (item) => idToString(item._id) === idToString(product.categoryId)
    ).name
  )

  const [catalogName, setCatalogName] = useState(
    product.catalogId
      ? catalogs.find(
          (item) => idToString(item._id) === idToString(product.catalogId)
        ).name
      : ""
  )

  const [values, setValues] = useState({
    _id: product._id,
    name: product.name,
    brandId: product.brandId,
    model: product.model,
    description: product.description,
    categoryId: product.categoryId,
    catalogId: product.catalogId,
    ownOptions: product.ownOptions,
    optionValues: product.optionValues,
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
  const [showImageUpload, setShowImageUpload] = useState(false)
  

  useEffect(() => {
    setValues({
      ...values,
      optionValues: createPriceObject({
        ownOptions: values.ownOptions,
        optionValues: values.optionValues,
      }),
    })
  }, [values.ownOptions])

  useEffect(() => {
    if (!values.categoryId) {
      setValues({ ...values, brandId: null })
      setCategoryName("")
    }
  }, [values.categoryId])

  useEffect(() => {
    if (!values.catalogId) setCatalogName("")
  }, [values.catalogId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Проверка на заполнение поля имени категории
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
    setBrand({ ...brand })
    setCategoryName(category.name)
    setValues({
      ...values,
      categoryId: category._id,
      brandId: brand._id,
      ownOptions: Object.assign(
        {},
        ...Object.keys(brand.options).map((option) => ({ [option]: [] }))
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
    
    setShowImageUpload(false)
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
            <div className={styles.right_icons}>
              <FaWindowClose
                className={styles.icon}
                title="Отмена"
                name="cancel"
                onClick={() => setIsShowProduct(false)}
              />
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
            <div className={styles.currency_value}>
              <p>{values.currencyValue}</p>
              <ul className={styles.dropdown_menu}>
                <li
                  onClick={() => setValues({ ...values, currencyValue: "UAH" })}
                >
                  UAH
                </li>
                <li
                  onClick={() => setValues({ ...values, currencyValue: "USD" })}
                >
                  USD
                </li>
                <li
                  onClick={() => setValues({ ...values, currencyValue: "EUR" })}
                >
                  EUR
                </li>
              </ul>
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
                <div
                  className={styles.cancell}
                  onClick={() => setValues({ ...values, categoryId: null })}
                >
                  <FaTimes />
                </div>

                <ul className={styles.dropdown_menu}>
                  {listForCategoryMenu && (
                    <>
                      {listForCategoryMenu.map((item, i) => (
                        <li key={i} onClick={() => handleListClick(item.cat)}>
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
                <div
                  className={styles.cancell}
                  onClick={() => setValues({ ...values, catalogId: null })}
                >
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

            <div className={styles.checkbox_wrapper}>
              <div className={styles.custom_checkbox}>
                <input
                  type="checkbox"
                  name="isShowcase"
                  id="isShowcase"
                  onChange={handleChange}
                  checked={values.isShowcase}
                />
                <label htmlFor="isShowcase">На витрине</label>
                <GiCheckMark className={styles.check_icon} />
              </div>
            </div>
          </div>
          {Object.keys(brand.options).length ? (
            <SelectOptions
              values={values}
              setValues={setValues}
              brand={brand}
              toast={toast}
            />
          ) : null}
          <PriceTable values={values} setValues={setValues} />
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

                        setShowImageUpload(true)
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

              setShowImageUpload(true)
            }}
          />
        </div>
      </div>
      {showImageUpload ? (
        <ModalDialog>
          <ModalImage
            handleUploadChange={handleUploadChange}
            setShowImageUpload={setShowImageUpload}
          />
        </ModalDialog>
      ) : null}
    </>
  )
}
