import styles from "@/styles/EditProduct.module.scss"
import {  useRef, useState } from "react"
import { getCurrencySymbol, getShortDescription } from "utils"
import { API_URL } from "../config"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useRouter } from "next/router"
import Links from "@/components/Links"

export default function EditProductList({
  prodList,
  setProdList,
  setIsShowProduct,
  setProduct,
  token,
}) {
  const router = useRouter()

  const [values, setValues] = useState({
    name: { name: "", id: "" },
    model: { name: "", id: "" },
    category: { name: "", id: "" },
    brand: { name: "", id: "" },
  })

  const [listNames, setListNames] = useState({
    name: [],
    model: [],
    category: [],
    brand: [],
  })

  const [delayTimer, setDelayTimer] = useState()
  const [prodForDelete, setProdForDelete] = useState({})
  const elemModal = useRef()

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

  const handleDeleteProduct = async ({ _id }) => {
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
      setProdList(prodList.filter((item) => item._id !== _id))
    }
  }

  const handleHover = async (e) => {
    const { name, value } = e.target
    await listNamesFetcher(name, value)
  }

  const handleChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    setValues({ ...values, [name]: { ...values[name], name: value, id: "" } })
    clearTimeout(delayTimer)
    setDelayTimer(
      setTimeout(async () => {
        await listNamesFetcher(name, value)
      }, 500)
    )
  }
  const handleListClick = ({ item, name }) => {
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
    setProdList([...data.products.sort((a, b) => (a.name > b.name ? 1 : -1))])
  }

  const handleModal = (item) => {
    elemModal.current.showModal()
    setProdForDelete(item)
  }
  const handle = (rez) => {
    if (rez) {
      handleDeleteProduct(prodForDelete)
    }
    setProdForDelete({})
    elemModal.current.close()
  }

  return (
    <div>
      <ToastContainer />
      <div className={styles.container}>
        <Links home={true} back={false} />
        <form onSubmit={submitHandler} className={styles.form}>
          <div>
            <label htmlFor="name">Модель</label>
            <div className={styles.input_group}>
              <input
                type="text"
                id="name"
                name="name"
                value={values.name.name}
                onChange={handleChange}
                onMouseOver={handleHover}
                autoComplete="off"
              />
              {listNames.name.length ? (
                <ul className={styles.drop_down_list}>
                  {listNames.name.map((item, i) => (
                    <li
                      key={i}
                      onClick={() => handleListClick({ item, name: "name" })}
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>

          <div>
            <label htmlFor="model">Артикул</label>

            <div
              className={styles.input_group}              
            >
              <input
                type="text"
                id="model"
                name="model"
                value={values.model.name}
                onChange={handleChange}
                onMouseOver={handleHover}
                autoComplete="off"
              />
              {listNames.model.length ? (
                <ul className={styles.drop_down_list}>
                  {listNames.model.map((item, i) => (
                    <li
                      key={i}
                      onClick={() => handleListClick({ item, name: "model" })}
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
          <div>
            <label htmlFor="category">Категория</label>
            <div
              className={styles.input_group}             
            >
              <input
                type="text"
                id="category"
                name="category"
                value={values.category.name}
                onChange={handleChange}
                onMouseOver={handleHover}
                autoComplete="off"
              />
              {listNames.category.length ? (
                <ul className={styles.drop_down_list}>
                  {listNames.category.map((item, i) => (
                    <li
                      key={i}
                      onClick={() =>
                        handleListClick({ item, name: "category" })
                      }
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
          <div>
            <label htmlFor="brand">Бренд</label>
            <div
              className={styles.input_group}              
            >
              <input
                type="text"
                id="brand"
                name="brand"
                value={values.brand.name}
                onChange={handleChange}
                onMouseOver={handleHover}
                autoComplete="off"
              />
              {listNames.brand.length ? (
                <ul className={styles.drop_down_list}>
                  {listNames.brand.map((item, i) => (
                    <li
                      key={i}
                      onClick={() => handleListClick({ item, name: "brand" })}
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
          <div className={styles.button_wrapper}>
            <div>&nbsp;</div>
            <button type="submit" className={styles.button}>
              <i className="fa-solid fa-magnifying-glass"></i>
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
                        />
                      </td>
                      <td>{item.name}</td>
                      <td>{item.model}</td>
                      <td>{getShortDescription(item.description, 150)}</td>
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
                            <i className="fa-solid fa-pencil fa-lg"></i>
                          </button>
                          <div>
                            <button
                              className={styles.delete}
                              onClick={() => handleModal(item)}
                            >
                              <i className="fa-solid fa-xmark fa-xl"></i>
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
      <dialog className={styles.dialog} ref={elemModal}>
        <div className={styles.dialog_wrapper}>
          <p>Удалить товар {prodForDelete.name}?</p>
          <div onClick={() => handle(true)}>Да</div>
          <div onClick={() => handle(false)}>Нет</div>
        </div>
      </dialog>
    </div>
  )
}


