import styles from "@/styles/EditProduct.module.css"

import AccessDenied from "@/components/AccessDenied"
import Layout from "@/components/Layout"
import AuthContext from "@/context/AuthContext"
import { useContext, useState } from "react"
import { getCurrencySymbol } from "utils"
import DropDownList from "@/components/DropDownList"
import { API_URL } from "../config"
import { FaPencilAlt, FaSearch, FaTimes } from "react-icons/fa"
import Link from "next/link"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useRouter } from "next/router"

import Links from "@/components/Links"


export default function editProductListPage() {
  const {
    user: { isAdmin, token },
  } = useContext(AuthContext)
  const router = useRouter()

  const [values, setValues] = useState({
    name: "",
    model: "",
    category: "",
    brand: "",
  })
  const [isShowList, setIsShowList] = useState({
    name: false,
    model: false,
    brand: false,
    category: false,
  })
  const [listNames, setListNames] = useState({
    name: [],
    model: [],
    category: [],
    brand: [],
  })
  const [prodList, setProdList] = useState([])
  const [delayTimer, setDelayTimer] = useState()

  const handleDeleteProduct = async ({ _id, idx }) => {
    if (confirm("Уверены?")) {
      const res = await fetch(`${API_URL}/api/products/${_id}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.message)
      } else {
        setProdList(prodList.filter((item, i) => i != idx))
      }
    }
  }
  const handleChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    setValues({ ...values, [name]: value })
    clearTimeout(delayTimer)
    setDelayTimer(
      setTimeout(async () => {
        const res = await fetch(
          `${API_URL}/api/search/list_names/${name}?string=${value}`
        )
        const data = await res.json()
        setListNames({ ...listNames, [name]: data.list })
      }, 1000)
    )
  }
  const handleListClick = ({ item, name }) => {
    setValues({ ...values, [name]: item })
  }
  const submitHandler = async (e) => {
    e.preventDefault()

    const res = await fetch(
      `${API_URL}/api/products/edit_search?name=${values.name.trim()}&category=${values.category.trim()}&brand=${values.brand.trim()}&model=${values.model.trim()}`
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
                <label htmlFor="name">Модель</label>

                <div
                  className={styles.input_group}
                  tabIndex={0}
                  onFocus={() => {
                    setIsShowList({ ...isShowList, name: true })
                  }}
                  onBlur={() => setIsShowList({ ...isShowList, name: false })}
                >
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    autoComplete="off"
                  />

                  <DropDownList
                    isShow={isShowList.name}
                    itemsList={listNames.name}
                    handleClick={(item) => {
                      handleListClick({ item, name: "name" })
                      setIsShowList({ ...isShowList, name: false })
                    }}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="model">Артикул</label>

                <div
                  className={styles.input_group}
                  tabIndex={0}
                  onFocus={() => {
                    setIsShowList({ ...isShowList, model: true })
                  }}
                  onBlur={() => setIsShowList({ ...isShowList, model: false })}
                >
                  <input
                    type="text"
                    id="model"
                    name="model"
                    value={values.model}
                    onChange={handleChange}
                    autoComplete="off"
                  />

                  <DropDownList
                    isShow={isShowList.model}
                    itemsList={listNames.model}
                    handleClick={(item) => {
                      handleListClick({ item, name: "model" })
                      setIsShowList({ ...isShowList, model: false })
                    }}
                  />
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
                    autoComplete="off"
                  />

                  <DropDownList
                    isShow={isShowList.category}
                    itemsList={listNames.category}
                    handleClick={(item) => {
                      handleListClick({ item, name: "category" })
                      setIsShowList({ ...isShowList, category: false })
                    }}
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
                    autoComplete="off"
                  />

                  <DropDownList
                    isShow={isShowList.brand}
                    itemsList={listNames.brand}
                    handleClick={(item) => {
                      handleListClick({ item, name: "brand" })
                      setIsShowList({ ...isShowList, brand: false })
                    }}
                  />
                </div>
              </div>
              <div className={styles.button_wrapper}>
                <div>&nbsp;</div>
                  {/* <input type="submit" className={styles.button} value="Найти" /> */}
                  <button type='submit' className={styles.button}><FaSearch/></button>
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


