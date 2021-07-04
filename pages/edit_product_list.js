import styles from "@/styles/EditProduct.module.css"

import AccessDenied from "@/components/AccessDenied"
import Layout from "@/components/Layout"
import AuthContext from "@/context/AuthContext"
import { useContext, useEffect, useState } from "react"
import { getCategoriesTree, getCurrencySymbol, getSearchItemsList } from "utils"
import DropDownList from "@/components/DropDownList"
import { API_URL } from "../config"
import { FaPencilAlt, FaTimes } from "react-icons/fa"
import Link from "next/link"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useRouter } from "next/router"
import Image from "next/image"
import Spinner from '@/components/Spinner'
import { fetchNames } from "dataFetchers"






export default  function editProductListPage() {
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
  
  const handleDeleteProduct = async (id) => {
    if (confirm("Уверены?")) {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.message)
      } else {
        getProdListFromQuery()
        router.push(router.pathname)
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

const { data, isLoading } = fetchNames()
  if (isLoading) return <Spinner/>
  const { brands, categories, products } = data
  
  return (
    <div>
      <Layout title="Редактирование товаров">
        <ToastContainer />
        {!isAdmin ? (
          <AccessDenied />
        ) : (
          <div className={styles.container}>
            <h3>Список товаров</h3>
            <Link href="/">На главную</Link>
            <form onSubmit={submitHandler} className={styles.form}>
              <div >
                <label htmlFor="product">Название</label>

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
                      itemsList={getSearchItemsList(products, values.product)}
                      handleClick={(item) =>
                        handleListClick({ item, name: "product" })
                      }
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
                  <DropDownList
                    isShow={isShowList.category}
                    itemsList={getSearchItemsList(categories, values.category)}
                    handleClick={(item) =>
                      handleListClick({ item, name: "category" })
                    }
                  />
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
                  <DropDownList
                    isShow={isShowList.brand}
                    itemsList={getSearchItemsList(brands, values.brand, 10)}
                    handleClick={(item) =>
                      handleListClick({ item, name: "brand" })
                    }
                  />
                </div>
              </div>
              <div >
                <div>&nbsp;</div>
                <input type="submit" className={styles.button} value="Найти" />
              </div>
            </form>

            <div className={styles.grid_header}>
              <div>Название</div>
              <div>Модель</div>
              <div>Описание</div>
              <div>Цена</div>
              <div>Управление</div>
              <div className={styles.grid_line}></div>
              {prodList.length
                ? prodList.map((item,i) => (
                  <div key= { i } className={styles.grid_body}>
                      <div>{item.name}</div>
                      <div>{item.model}</div>
                      <div>{item.description}</div>
                      <div>
                        {item.price}
                        {getCurrencySymbol(item.currencyValue)}
                      </div>

                      <div className={styles.buttons}>
                        <Link href={`/edit_product/${item.slug}`}>
                          <a className={styles.edit}>
                            <FaPencilAlt className={styles.icon} />
                          </a>
                        </Link>

                        <button
                          className={styles.delete}
                          onClick={() => handleDeleteProduct(`${item._id}`)}
                        >
                          <span>
                            <FaTimes className={styles.icon} />
                          </span>
                        </button>
                      </div>
                      <div className={styles.grid_line}></div>
                    </div>
                  ))
                : null}
            </div>
          </div>
        )}
      </Layout>
    </div>
  )
}

// export async function getServerSideProps() {
//   const res = await fetch(`${API_URL}/api/products/names`)
//   const { products, brands, categories } = await res.json()

//   return {
//     props: {
//       products,
//       categories,
//       brands,
//     },
//   }
// }
