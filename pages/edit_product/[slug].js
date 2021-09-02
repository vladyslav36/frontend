import styles from "@/styles/Form.module.css"
import AccessDenied from "@/components/AccessDenied"
import Layout from "@/components/Layout"
import Modal from "@/components/Modal"
import ImagesUpload from "@/components/ImagesUpload"
import AuthContext from "@/context/AuthContext"
import { useContext, useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import { FaImage, FaPlus, FaTimes } from "react-icons/fa"
import { useRouter } from "next/router"
import Link from "next/link"
import { API_URL } from "@/config/index"
import "react-toastify/dist/ReactToastify.css"
import { getCategoriesTree, stringToPrice } from "../../utils"
import SelectOptions from "@/components/SelectOptions"

export default function editProductPage({ categories, brands,product }) {
  const {
    user: { isAdmin },
  } = useContext(AuthContext)

  const [values, setValues] = useState({
    _id:product._id,
    name: product.name,
    model: product.model,
    brand: product.brand,
    brandId: product.brandId,        
    description: product.description,
    category: product.category,
    categoryId: product.categoryId,
    colors: [...product.colors],
    sizes: [...product.sizes],
    heights: [...product.heights],
    isInStock: product.isInStock ? "ДА" : "НЕТ",
    price: product.price,
    retailPrice: product.retailPrice,
    isShowcase: product.isShowcase ? "ДА" : "НЕТ",    
    currencyValue: product.currencyValue,
  })
  
  const [images,setImages]=useState(product.images.map(item => {
    return { file: null, path: `${API_URL}${item}` }
   }))
  const [showModal, setShowModal] = useState(false)
  const [isShowList, setIsShowList] = useState(false)
  const [isShowBrandsList, setIsShowBrandsList] = useState(false)
  const [listForMenu, setListForMenu] = useState(getListForMenu(categories, ""))
  const [listForBrandsMenu, setListForBrandsMenu] = useState(
    getListForMenu(brands, "")
  )
   
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
    const imageClientPaths = images.map(item => item.path)
    formData.append('imageClientPaths',JSON.stringify(imageClientPaths))
    images.forEach((item) => formData.append("images", item.file))
    const res = await fetch(`${API_URL}/api/products`, {
      method: "PUT",
      headers: {
        enctype: "multipart/form-data",
      },
      body: formData,
    })

    if (!res.ok) {
      toast.error("Что-то пошло не так")
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
console.log(images)
  return (
    <Layout title="Добавление товара">
      {!isAdmin ? (
        <AccessDenied />
      ) : (
        <>
          <div className={styles.form}>
            <form onSubmit={handleSubmit}>
              <div className={styles.header}>
                <h1>Редактирование {product.name}</h1>
                <input type="submit" value="Сохранить" className="btn" />
              </div>

              <Link href="/">На главную</Link>
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

                <div>
                  <div>
                    <div className={styles.select_block}>
                      <p>Показывать на витрине</p>
                      <select
                        value={values.isShowcase}
                        name="isShowcase"
                        id="isShowcase"
                        onChange={handleChange}
                      >
                        <option value="НЕТ">НЕТ</option>
                        <option value="ДА">ДА</option>
                      </select>
                    </div>
                    <div className={styles.select_block}>
                      <p>В наличии</p>
                      <select
                        name="isInStock"
                        id="isInStock"
                        onChange={handleChange}
                      >
                        <option value="ДА">ДА</option>
                        <option value="НЕТ">НЕТ</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              {values.brand && (
                <SelectOptions
                  brandId={values.brandId}
                  brands={brands}
                  values={values}
                  setValues={setValues}
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
        </>
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

export async function getServerSideProps({params:{slug}}) {
  const categoriesData = await fetch(`${API_URL}/api/categories`)
  const { categories } = await categoriesData.json()  
  const brandsData = await fetch(`${API_URL}/api/brands`)
  const { brands } = await brandsData.json()
  const res = await fetch(`${API_URL}/api/products/${slug}`)
  const { product } = await res.json()
  return {
    props: {
      categories,
      brands,
      product,
      
    }
  }
}




// import styles from "@/styles/Form.module.css"
// import AccessDenied from "@/components/AccessDenied"
// import Layout from "@/components/Layout"
// import Modal from "@/components/Modal"
// import ImageUpload from "@/components/ImageUpload"
// import AuthContext from "@/context/AuthContext"
// import { useContext, useEffect, useState } from "react"
// import { ToastContainer, toast } from "react-toastify"
// import { FaImage, FaPlus, FaTimes } from "react-icons/fa"
// import { useRouter } from "next/router"
// import Link from "next/link"
// import Image from "next/image"
// import { API_URL, NOIMAGE_PATH } from "@/config/index"
// import "react-toastify/dist/ReactToastify.css"
// import { getCategoriesTree, stringToPrice } from "../../utils"
// import SelectOptions from "@/components/SelectOptions"

// export default function editProductPage({ categories, brands,product }) {
//   const {
//     user: { isAdmin },
//   } = useContext(AuthContext)

//   const [values, setValues] = useState({
//     _id:product._id,
//     name: product.name,
//     model: product.model,
//     brand: product.brand,
//     brandId: product.brandId,
//     image: product.image,    
//     description: product.description,
//     category: product.category,
//     categoryId: product.categoryId,
//     colors: [...product.colors],
//     sizes: [...product.sizes],
//     heights: [...product.heights],
//     isInStock: product.isInStock ? "ДА" : "НЕТ",
//     price: product.price,
//     retailPrice: product.retailPrice,
//     isShowcase: product.isShowcase ? "ДА" : "НЕТ",
//     addedImages: [...product.addedImages],
//     currencyValue: product.currencyValue,
//   })
//   const [showModal, setShowModal] = useState(false)
//   const [isShowList, setIsShowList] = useState(false)
//   const [isShowBrandsList, setIsShowBrandsList] = useState(false)
//   const [listForMenu, setListForMenu] = useState(getListForMenu(categories, ""))
//   const [listForBrandsMenu, setListForBrandsMenu] = useState(
//     getListForMenu(brands, "")
//   )
//   const [upploadCb, setUpploadCb] = useState({})  
//   const [imageIdx, setImageIdx] = useState(0)

//   const router = useRouter()
//   // Функция возвращает список категорий или брендов в соответствии со строкой поиска
//   function getListForMenu(items, value) {
//     const list = items.filter(
//       ({ name }) => name.toLowerCase().indexOf(value.toLowerCase()) >= 0
//     )
//     return list
//   }
//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     // Проверка на заполнение поля имени категории
//     const hasEmptyFields = !values.name.trim() || !values.model.trim()
//     if (hasEmptyFields) {
//       toast.error("Поле Название и Модель должны быть заполнены")
//       return
//     }
//     // Проверка на наличие и соответствие родительской категории в категориях
//     if (values.category) {
//       const isValid = categories.some(
//         (item) =>
//           item.name === values.category && item._id === values.categoryId
//       )
//       if (!isValid) {
//         toast.error("Родительская категория должна быть выбрана из списка")
//         return
//       }
//     } else {
//       values.categoryId = null
//     }
//     // Проверка на наличие и соответствии бренда в брендах
//     if (values.brand) {
//       const isValid = brands.some(
//         (item) => item.name === values.brand && item._id === values.brandId
//       )
//       if (!isValid) {
//         toast.error("Бренд должен  быть выбран из списка")
//         return
//       }
//     } else {
//       values.brandId = null
//     }
//     // Send data
//     const res = await fetch(`${API_URL}/api/products`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(values),
//     })
//     const data = await res.json()

//     if (!res.ok) {
//       toast.error("Что-то пошло не так")
//     } else {
//       router.push("/")
//     }
//   }
//   const formatPrice = ({ name, value }) => {
//     let { price, error } = stringToPrice(value)    
//     if (error) {
//       price = ""
//       toast.error("Прайс должен быть числом")
//     }
//     setValues({ ...values, [name]: price })
//   }
//   // input для name & model ...
//   const handleChange = (e) => {
//     e.preventDefault()
//     const { name, value } = e.target
//     setValues({ ...values, [name]: value })
//   }

//   // input for parentCategory
//   const handleChangeCategory = (e) => {
//     e.preventDefault()
//     const { name, value } = e.target

//     setValues({ ...values, [name]: value })
//     setIsShowList(true)
//     setListForMenu(getListForMenu(categories, value))
//   }
//   // Input for brands
//   const handleChangeBrand = (e) => {
//     e.preventDefault()
//     const { name, value } = e.target
//     setValues({ ...values, [name]: value })
//     setIsShowBrandsList(true)
//     setListForBrandsMenu(getListForMenu(brands, value))
//   }

//   const handleListClick = ({ name, id }) => {
//     setValues({ ...values, category: name, categoryId: id })
//     setIsShowList(false)
//   }
//   const handleListBrandClick = ({ name, id }) => {
//     setValues({ ...values, brand: name, brandId: id })
//     setIsShowBrandsList(false)
//   }

//   const imageUpploaded = (path) => {
//     setShowModal(false)    
//     setValues({ ...values, image: path })
//   }

//   const imagesUpploaded = (path, index) => {
//     setShowModal(false)
//     setValues({ ...values, addedImages: values.addedImages.map((item, i) => (i === index ? path : item)) })
    
//   }

//   const imagesNewUpploaded = (path) => {
//     setShowModal(false)
//     setValues({...values,addedImages:[...values.addedImages,path]})
//      } 

//   return (
//     <Layout title="Добавление товара">
//       {!isAdmin ? (
//         <AccessDenied />
//       ) : (
//         <>
//           <div className={styles.form}>
//             <form onSubmit={handleSubmit}>
//               <div className={styles.header}>
//                 <h1>Редактирование {product.name}</h1>
//                 <input type="submit" value="Сохранить" className="btn" />
//               </div>

//               <Link href="/">На главную</Link>
//               <ToastContainer />
//               <div className={styles.grid}>
//                 <div>
//                   <label htmlFor="name">Название</label>
//                   <input
//                     type="text"
//                     id="name"
//                     name="name"
//                     value={values.name}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="model">Модель</label>
//                   <input
//                     type="text"
//                     id="model"
//                     name="model"
//                     value={values.model}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="brand">Бренд</label>
//                   <div
//                     className={styles.input_group_menu}
//                     tabIndex={0}
//                     onFocus={() => setIsShowBrandsList(true)}
//                     onBlur={() => setIsShowBrandsList(false)}
//                   >
//                     <input
//                       type="text"
//                       id="brand"
//                       name="brand"
//                       value={values.brand}
//                       onChange={handleChangeBrand}
//                     />

//                     <ul
//                       className={
//                         styles.dropdown_menu +
//                         " " +
//                         (isShowBrandsList && styles.active)
//                       }
//                     >
//                       {listForBrandsMenu && (
//                         <>
//                           {listForBrandsMenu.map((brand) => (
//                             <li
//                               key={brand._id}
//                               onClick={() =>
//                                 handleListBrandClick({
//                                   id: brand._id,
//                                   name: brand.name,
//                                 })
//                               }
//                             >
//                               {brand.name}
//                             </li>
//                           ))}
//                         </>
//                       )}
//                     </ul>
//                   </div>
//                 </div>
//                 <div>
//                   <label htmlFor="category">Категория</label>
//                   <div
//                     className={styles.input_group_menu}
//                     tabIndex={0}
//                     onFocus={() => setIsShowList(true)}
//                     onBlur={() => setIsShowList(false)}
//                   >
//                     <input
//                       type="text"
//                       id="category"
//                       name="category"
//                       value={values.category}
//                       onChange={handleChangeCategory}
//                     />

//                     <ul
//                       className={
//                         styles.dropdown_menu +
//                         " " +
//                         (isShowList && styles.active)
//                       }
//                     >
//                       {listForMenu && (
//                         <>
//                           {listForMenu.map((category) => (
//                             <li
//                               key={category._id}
//                               onClick={() =>
//                                 handleListClick({
//                                   name: category.name,
//                                   id: category._id,
//                                 })
//                               }
//                             >
//                               {getCategoriesTree(category, categories)}
//                             </li>
//                           ))}
//                         </>
//                       )}
//                     </ul>
//                   </div>
//                 </div>

//                 <div>
//                   <div className={styles.labels}>
//                     <label htmlFor="price">Цена (опт)</label>
//                     <label htmlFor="retailPrice">Цена (розн)</label>
//                     <label htmlFor="currencyValue">Валюта товара</label>
//                   </div>
//                   <div className={styles.input_price}>
//                     <div tabIndex={0}>
//                       <input
//                         type="text"
//                         id="price"
//                         name="price"
//                         value={values.price}
//                         onChange={handleChange}
//                         onBlur={(e) =>
//                           formatPrice({ name: "price", value: e.target.value })
//                         }
//                       />
//                     </div>
//                     <div tabIndex={0}>
//                       <input
//                         type="text"
//                         id="retailPrice"
//                         name="retailPrice"
//                         value={values.retailPrice}
//                         onChange={handleChange}
//                         onBlur={(e) =>
//                           formatPrice({ name: "retailPrice", value: e.target.value })
//                         }
//                       />
//                     </div>
//                     <div>
//                       <select
//                         className={styles.input}
//                         name="currencyValue"
//                         id="currencyValue"
//                         value={values.currencyValue}
//                         onChange={handleChange}
//                       >
//                         <option value="UAH">UAH</option>
//                         <option value="USD">USD</option>
//                         <option value="EUR">EUR</option>
//                       </select>
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <div>
//                     <div className={styles.select_block}>
//                       <p>Показывать на витрине</p>
//                       <select
//                         value={values.isShowcase}
//                         name="isShowcase"
//                         id="isShowcase"
//                         onChange={handleChange}
//                       >
//                         <option value="НЕТ">НЕТ</option>
//                         <option value="ДА">ДА</option>
//                       </select>
//                     </div>
//                     <div className={styles.select_block}>
//                       <p>В наличии</p>
//                       <select
//                         name="isInStock"
//                         id="isInStock"
//                         onChange={handleChange}
//                       >
//                         <option value="ДА">ДА</option>
//                         <option value="НЕТ">НЕТ</option>
//                       </select>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               {values.brand && (
//                 <SelectOptions
//                   brandId={values.brandId}
//                   brands={brands}
//                   values={values}
//                   setValues={setValues} 
//                 />
//               )}
//               <div>
//                 <label htmlFor="description">Описание</label>
//                 <textarea
//                   type="text"
//                   id="description"
//                   name="description"
//                   value={values.description}
//                   onChange={handleChange}
//                 ></textarea>
//               </div>
//             </form>
//           </div>
//           <h2>Основное изображение</h2>
//           <div className={styles.image_container}>
//             <div className={styles.image}>
//               {values.image ? (
//                 <img
//                   src={`${API_URL}${values.image}`}                  
//                 />
//               ) : (
//                 <div className={styles.image}>
//                   <img
//                     src={`${API_URL}${NOIMAGE_PATH}`}                    
//                     alt="No Image"
//                   />
//                 </div>
//               )}
//             </div>
//             <div className={styles.image_footer}>
//               <button
//                 className="btn"
//                 onClick={() => {
//                   setShowModal(true)
//                   setIsShowList(false)
//                   setUpploadCb({ cb: imageUpploaded })
//                 }}
//               >
//                 <FaImage />
//               </button>
//               <button
//                 className="btn btn-danger"
//                 onClick={() => {
//                   setValues({ ...values, image: "" })
//                 }}
//               >
//                 <FaTimes />
//               </button>
//             </div>
//           </div>
//           <h2>Дополнительные изображения</h2>
//           <div className={styles.images_container}>
//             {values.addedImages.length
//               ? values.addedImages.map((item, i) => (
//                   <div key={i} className={styles.image_container}>
//                     <div className={styles.image}>
//                       <img
//                         src={`${API_URL}${item}`}                       
//                       />
//                     </div>
//                     <div className={styles.image_footer}>
//                       <button
//                         className="btn"
//                         onClick={() => {
//                           setImageIdx(i)
//                           setShowModal(true)
//                           setIsShowList(false)
//                           setUpploadCb({ cb: imagesUpploaded })
//                         }}
//                       >
//                         <FaImage />
//                       </button>
//                       <button
//                         className="btn btn-danger"
//                         onClick={() => {
//                           setValues({
//                             ...values,
//                             addedImages: values.addedImages.filter(
//                               (item, idx) => idx !== i
//                             ),
//                           })
//                         }}
//                       >
//                         <FaTimes />
//                       </button>
//                     </div>
//                   </div>
//                 ))
//               : null}
//             <button
//               className="btn"
//               onClick={() => {
//                 setShowModal(true)
//                 setIsShowList(false)
//                 setUpploadCb({ cb: imagesNewUpploaded })
//               }}
//             >
//               <FaPlus />
//             </button>
//           </div>
//         </>
//       )}
//       <Modal show={showModal} onClose={() => setShowModal(false)}>
//         <ImageUpload imageUploaded={upploadCb.cb} index={imageIdx} />
//       </Modal>
//     </Layout>
//   )
// }

// export async function getServerSideProps({params:{slug}}) {
//   const categoriesData = await fetch(`${API_URL}/api/categories`)
//   const { categories } = await categoriesData.json()  
//   const brandsData = await fetch(`${API_URL}/api/brands`)
//   const { brands } = await brandsData.json()
//   const res = await fetch(`${API_URL}/api/products/${slug}`)
//   const { product } = await res.json()
//   return {
//     props: {
//       categories,
//       brands,
//       product,
      
//     }
//   }
// }




