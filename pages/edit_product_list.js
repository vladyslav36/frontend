import styles from "@/styles/EditProduct.module.css"

import AccessDenied from "@/components/AccessDenied"
import Layout from "@/components/Layout"
import AuthContext from "@/context/AuthContext"
import { useContext, useState } from "react"
import {  getCurrencySymbol, getSearchItemsList } from "utils"
import DropDownList from "@/components/DropDownList"
import { API_URL } from "../config"
import { FaPencilAlt, FaTimes } from "react-icons/fa"
import Link from "next/link"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useRouter } from "next/router"

import Links from "@/components/Links"
import useSWR from "swr"

export default  function editProductListPage({products,categories,brands}) {
  const {
    user: { isAdmin },
  } = useContext(AuthContext)
  const router = useRouter()  
  
  const [values, setValues] = useState({
    product: "",
    category: "",
    brand: "",
  })
  const [isShowList, setIsShowList] = useState({
    product: false,
    brand: false,
    category: false,
  })
  const [prodList, setProdList] = useState([])    
  
  const handleDeleteProduct = async ({_id,idx}) => {
    if (confirm("Уверены?")) {
      const res = await fetch(`${API_URL}/api/products/${_id}`, {
        method: "DELETE",
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.message)
      } else {
        setProdList(prodList.filter((item,i)=>i!=idx))
        
      }
    }
  }
  const handleChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    setValues({ ...values, [name]: value })
  }
  const handleListClick = ({ item, name }) => {
    setValues({ ...values, [name]: item })
  }
  const submitHandler = async (e) => {
    e.preventDefault()

   const res = await fetch(
     `${API_URL}/api/products/search?product=${values.product}&category=${values.category}&brand=${values.brand}`
   )
   const { products } = await res.json()

   setProdList([...products])
  }
  
  return (
    <div>
      <Layout title="Редактирование товаров">
        <ToastContainer />
        {!isAdmin ? (
          <AccessDenied />
        ) : (
          <div className={styles.container}>
            <Links home={true} back={false} />
            <form onSubmit={submitHandler} className={styles.form}>
              <div>
                <label htmlFor="product">Модель</label>

                <div
                  className={styles.input_group}
                  tabIndex={0}
                  onFocus={() =>
                    setIsShowList({ ...isShowList, product: true })
                  }
                  onBlur={() =>
                    setIsShowList({ ...isShowList, product: false })
                  }
                >
                  <input
                    type="text"
                    id="product"
                    name="product"
                    value={values.product}
                    onChange={handleChange}
                  />
                  {products.length ? (
                    <DropDownList
                      isShow={isShowList.product}
                      itemsList={getSearchItemsList(
                        products,
                        values.product
                      )}
                      handleClick={(item) => {
                        handleListClick({ item, name: "product" })
                        setIsShowList({ ...isShowList, product: false })
                      }}
                    />
                  ) : null}
                </div>
              </div>
              <div>
                <label htmlFor="category">Категория</label>
                <div
                  className={styles.input_group}
                  tabIndex={0}
                  onFocus={() =>
                    setIsShowList({ ...isShowList, category: true })
                  }
                  onBlur={() =>
                    setIsShowList({ ...isShowList, category: false })
                  }
                >
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={values.category}
                    onChange={handleChange}
                  />
                  {categories.length ? (
                    <DropDownList
                      isShow={isShowList.category}
                      itemsList={getSearchItemsList(
                        categories,
                        values.category
                      )}
                      handleClick={(item) => {
                        handleListClick({ item, name: "category" })
                        setIsShowList({ ...isShowList, category: false })
                      }}
                    />
                  ) : null}
                </div>
              </div>
              <div>
                <label htmlFor="brand">Бренд</label>
                <div
                  className={styles.input_group}
                  tabIndex={0}
                  onFocus={() => setIsShowList({ ...isShowList, brand: true })}
                  onBlur={() => setIsShowList({ ...isShowList, brand: false })}
                >
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={values.brand}
                    onChange={handleChange}
                  />
                  {brands.length ? (
                    <DropDownList
                      isShow={isShowList.brand}
                      itemsList={getSearchItemsList(
                        brands,
                        values.brand,
                        10
                      )}
                      handleClick={(item) => {
                        handleListClick({ item, name: "brand" })
                        setIsShowList({ ...isShowList, brand: false })
                      }}
                    />
                  ) : null}
                </div>
              </div>
              <div>
                <div>&nbsp;</div>
                <input type="submit" className={styles.button} value="Найти" />
              </div>
            </form>
            <table>
              <thead>
                <tr>
                  <th>&nbsp;</th>
                  <th>Модель</th>
                  <th>Артикул</th>
                  <th>Описание</th>
                  <th>Цена</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {prodList.length
                  ? prodList.map((item, i) => (
                      <tr key={i}>
                        <td>
                          <img
                            src={
                              item.imagesSm.length
                                ? `${API_URL}${item.imagesSm[0]}`
                                : `/noimage.png`
                            }
                            alt="no image"
                          />
                        </td>
                        <td>{item.name}</td>
                        <td>{item.model}</td>
                        <td>{item.description}</td>
                        <td>
                          {item.price}&nbsp;
                          {getCurrencySymbol(item.currencyValue)}
                        </td>
                        <td>
                          <div className={styles.buttons_wrapper}>
                            <div className={styles.edit}>
                              <Link href={`/edit_product/${item.slug}`}>
                                <a>
                                  <FaPencilAlt className={styles.icon} />
                                </a>
                              </Link>
                            </div>
                            <div>
                              <button
                                className={styles.delete}
                                onClick={() =>
                                  handleDeleteProduct({
                                    _id: `${item._id}`,
                                    idx: i,
                                  })
                                }
                              >
                                <span>
                                  <FaTimes className={styles.icon} />
                                </span>
                              </button>
                            </div>
                          </div>
                          
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </div>
        )}
      </Layout>
    </div>
  )
}

export async function getServerSideProps() {
  const res = await fetch(`${API_URL}/api/products/names`)
  const { products, brands, categories } = await res.json()

  return {
    props: {
      products,
      categories,
      brands,
    },
  }
}
