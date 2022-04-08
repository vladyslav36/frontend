import styles from "@/styles/EditProduct.module.css"
import { useState } from "react"
import { getCurrencySymbol, getShortDescription } from "utils"
import { API_URL } from "../config"
import { FaPencilAlt, FaSearch, FaTimes } from "react-icons/fa"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useRouter } from "next/router"
import Links from "@/components/Links"
import DropDownListItems from "./DropDownListItems"

export default function EditProductList({
  prodList,
  setProdList,
  setIsShowProduct,
  setProduct,
  token,
  categories,
}) {
  const router = useRouter()

  const [values, setValues] = useState({
    name: { name: "", id: "" },
    model: { name: "", id: "" },
    category: { name: "", id: "" },
    brand: { name: "", id: "" },
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

  const [delayTimer, setDelayTimer] = useState()

  const listNamesFetcher = async (name, value) => {
    const res = await fetch(`${API_URL}/api/search/list_names/${name}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: values.name.name,
        model: values.model.name,
        string: value.trim(),
        categoryId: values.category.id,
        brandId: values.brand.id,
      }),
    })
    const data = await res.json()
    setListNames({ ...listNames, [name]: data.list })
  }

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
    setValues({ ...values, [name]: { ...values[name], name: value, id: "" } })
    clearTimeout(delayTimer)
    setDelayTimer(
      setTimeout(async () => {
        await listNamesFetcher(name, value)
      }, 1000)
    )
  }
  const handleListClick = async ({ item, name }) => {
    setValues({ ...values, [name]: item })
  }
  const submitHandler = async (e) => {
    e.preventDefault()

    const res = await fetch(`${API_URL}/api/products/edit_search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: values.name.name.trim(),
        model: values.model.name.trim(),
        brandId: values.brand.id,
        categoryId: values.category.id,
      }),
    })
    const data = await res.json()
    if (!res.ok) {
      toast.error(data.message)
    }
    setProdList([...data.products.sort((a,b)=>a.name>b.name?1:-1)])
  }

  return (
    <div>
      <ToastContainer />
      <div className={styles.container}>
        <Links home={true} back={false} />
        <form onSubmit={submitHandler} className={styles.form}>
          <div>
            <label htmlFor="name">Модель</label>

            <div
              className={styles.input_group}
              tabIndex={0}
              onFocus={async () => {
                setIsShowList({ ...isShowList, name: true })
                await listNamesFetcher("name", "")
              }}
              onBlur={() => setIsShowList({ ...isShowList, name: false })}
            >
              <input
                type="text"
                id="name"
                name="name"
                value={values.name.name}
                onChange={handleChange}
                autoComplete="off"
              />

              <DropDownListItems
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
              onFocus={async () => {
                setIsShowList({ ...isShowList, model: true })
                await listNamesFetcher("model", "")
              }}
              onBlur={() => setIsShowList({ ...isShowList, model: false })}
            >
              <input
                type="text"
                id="model"
                name="model"
                value={values.model.name}
                onChange={handleChange}
                autoComplete="off"
              />

              <DropDownListItems
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
              onFocus={async () => {
                setIsShowList({ ...isShowList, category: true })
                await listNamesFetcher("category", "")
              }}
              onBlur={() => setIsShowList({ ...isShowList, category: false })}
            >
              <input
                type="text"
                id="category"
                name="category"
                value={values.category.name}
                onChange={handleChange}
                autoComplete="off"
              />

              <DropDownListItems
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
              onFocus={async () => {
                setIsShowList({ ...isShowList, brand: true })
                await listNamesFetcher("brand", "")
              }}
              onBlur={() => setIsShowList({ ...isShowList, brand: false })}
            >
              <input
                type="text"
                id="brand"
                name="brand"
                value={values.brand.name}
                onChange={handleChange}
                autoComplete="off"
              />

              <DropDownListItems
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
            <button type="submit" className={styles.button}>
              <FaSearch />
            </button>
          </div>
        </form>
        <div className={styles.table}>
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
                      <td>{getShortDescription(item.description,150)}</td>
                      <td>
                        {item.price}&nbsp;
                        {getCurrencySymbol(item.currencyValue)}
                      </td>
                      <td>
                        <div className={styles.buttons_wrapper}>
                          <button
                            className={styles.edit}
                            onClick={() => {
                              setProduct(item)
                              setIsShowProduct(true)
                            }}
                          >
                            <FaPencilAlt className={styles.icon} />
                          </button>
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
      </div>
    </div>
  )
}
