import styles from "@/styles/Form.module.css"
import Modal from "@/components/Modal"
import ImagesUpload from "@/components/ImagesUpload"
import { useEffect, useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import { FaImage, FaPlus, FaTimes } from "react-icons/fa"
import { useRouter } from "next/router"
import { API_URL } from "@/config/index"
import "react-toastify/dist/ReactToastify.css"
import {
  getBrand,
  getCategoriesTree,
  idToString,
  stringToPrice,
} from "../utils"
import SelectOptions from "@/components/SelectOptions"
import Links from "@/components/Links"
import { GiCheckMark } from "react-icons/gi"

export default function EditProduct({
  setProdList,
  prodList,
  categories,
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
  const [values, setValues] = useState({
    _id: product._id,
    name: product.name,
    brandId: product.brandId,
    model: product.model,
    description: product.description,
    category: categoryName,
    categoryId: product.categoryId,
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
  const [showModal, setShowModal] = useState(false)
  const [isShowList, setIsShowList] = useState(false)
  const [listForMenu, setListForMenu] = useState(getListForMenu(categories, ""))

  const [imageIdx, setImageIdx] = useState(0)

  const router = useRouter()

  useEffect(() => {
    const names = categories.map((item) => item.name)
    const isExist = names.includes(values.category)
    if (!isExist) {
      setValues({ ...values, categoryId: null })
    }
  }, [values.category])

  useEffect(() => {
    if (!values.categoryId) setValues({ ...values, options: {} })
  }, [values.categoryId])

  // ?????????????? ???????????????????? ???????????? ?????????????????? ?? ???????????????????????? ???? ?????????????? ????????????
  function getListForMenu(items, value) {
    const list = items.filter(
      ({ name }) => name.toLowerCase().indexOf(value.toLowerCase()) >= 0
    )
    return list
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    // ???????????????? ???? ???????????????????? ???????? ?????????? ??????????????????
    const hasEmptyFields = !values.name.trim() || !values.model.trim()
    if (hasEmptyFields) {
      toast.error("???????? ???????????????? ?? ???????????? ???????????? ???????? ??????????????????")
      return
    }
    // ???????????????? ???? ?????????????? ?? ???????????????????????? ?????????????????? ?? ????????????????????
    if (values.category) {
      const isValid = categories.some(
        (item) =>
          item.name === values.category && item._id === values.categoryId
      )
      if (!isValid) {
        toast.error("?????????????????? ???????????? ???????? ?????????????? ???? ????????????")
        return
      }
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
      setProdList(prodList.map(item=>item._id!=data.product._id?item:data.product))
      setIsShowProduct(false)
    }
  }
  const formatPrice = ({ name, value }) => {
    let { price, error } = stringToPrice(value)
    if (error) {
      price = ""
      toast.error("?????????? ???????????? ???????? ????????????")
    }
    setValues({ ...values, [name]: price })
  }
  // input ?????? name & model ...
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
    setValues({
      ...values,
      category: category.name,
      categoryId: category._id,
      brandId: brand._id,
      options: { ...brand.options },
    })
  }

  const deleteImage = (i) => {
    URL.revokeObjectURL(images[i].path)
    setImages(images.filter((item, idx) => idx !== i))
  }

  return (
    <>
      <>
        <div className={styles.form}>
          <form onSubmit={handleSubmit}>
            <div className={styles.header}>
              <Links home={true} />
              <div className={styles.buttons_flex_wrapper}>
                <input
                  type="button"
                  value="????????????"
                  className="btn"
                  onClick={() => setIsShowProduct(false)}
                />
                <input type="submit" value="??????????????????" className="btn" />
              </div>
            </div>

            <ToastContainer />
            <div className={styles.grid}>
              <div>
                <label htmlFor="name">????????????????</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="model">????????????</label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={values.model}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="category">??????????????????</label>
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
                      styles.dropdown_menu + " " + (isShowList && styles.active)
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
                  <label htmlFor="price">???????? (??????)</label>
                  <label htmlFor="retailPrice">???????? (????????)</label>
                  <label htmlFor="currencyValue">???????????? ????????????</label>
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
                  <label htmlFor="isShowcase">???????????????????? ???? ??????????????</label>
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
                  <label htmlFor="isInStock">?? ??????????????</label>
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
            {Object.keys(values.options).length ? (
              <SelectOptions
                values={values}
                setValues={setValues}
                toast={toast}
              />
            ) : null}
            <div>
              <label htmlFor="description">????????????????</label>
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
        <h2>??????????????????????</h2>
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
      </>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <ImagesUpload
          setShowModal={setShowModal}
          images={images}
          setImages={setImages}
          idx={imageIdx}
        />
      </Modal>
    </>
  )
}
