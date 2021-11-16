import Layout from "@/components/Layout"
import AuthContext from "@/context/AuthContext"
import { useContext, useRef, useState } from "react"
import { API_URL, NOIMAGE_PATH } from "../config"
import styles from "@/styles/OptionForm.module.css"
import "react-toastify/dist/ReactToastify.css"
import { toast, ToastContainer } from "react-toastify"
import { FaImage, FaPlus, FaPlusCircle, FaTimes } from "react-icons/fa"

import { useRouter } from "next/router"

import AccessDenied from "@/components/AccessDenied"
import Links from "@/components/Links"
import DropDownList from "@/components/DropDownList"

export default function add_optionPage({ categories }) {
  // const {
  //   user: { isAdmin, token },
  // } = useContext(AuthContext)
  const categoriesList = categories.map((item) => item.name).sort()
  const isAdmin = true
  const router = useRouter()
  const [inputValue, setInputValue] = useState({
    brand: "",
    option: "",
  })

  const [options, setOptions] = useState([])
  //example  [{name:'color',values:[red,green,blue]},{...},{...}]
  const [isShowList, setIsShowList] = useState({})
  //example {color:true,size:false,height:false}
  const [isShow, setIsShow] = useState(false)
  // dropdown list for categories

  const handleSubmit = async (e) => {
    e.preventDefault()
    const value = {
      name: inputValue.brand,
      brandId: categories.find((item) => item.name === inputValue.brand)._id,
      options: options,
    }
    console.log(value)
    const res = await fetch(`${API_URL}/api/options`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(value),
    })
    const data = await res.json()
    console.log(data.data)
    if (!res.ok) {
      toast.error(data.message)
    } else {
      toast.success("Опции успешно сохранены")
      setOptions([])
      setInputValue({ brand: "", option: "" })
    }
  }
  const handleInput = async (e) => {
    e.preventDefault()

    const { name, value } = e.target
    setInputValue({ ...inputValue, [name]: value })
  }

  const addOption = () => {
    const elem = document.getElementById("option")
    elem.focus()
    if (!inputValue.option) {
      toast.error("Заполните поле опция")
      return
    }
    const keys = Object.keys(inputValue)
    const isRepeat = keys.find((item) => item === inputValue.option)
    if (!isRepeat) {
      setInputValue({ ...inputValue, [inputValue.option]: "", option: "" })
      setOptions([...options, { name: inputValue.option, values: [] }])
      setIsShowList({ ...isShowList, [inputValue.option]: false })
    } else {
      toast.error("Такая опция уже существует или зарезервирована")
    }
  }

  const addOptionValue = ({ name, value }) => {
    if (!value) {
      toast.error("Заполните поле значение опции")
      return
    }
    const elem = document.getElementById(name)
    elem.focus()
    setOptions(
      options.map((item) =>
        item.name !== name ? item : { name, values: [...item.values, value] }
      )
    )
    setInputValue({ ...inputValue, [name]: "" })
  }

  const getShowKey = () =>
    Object.keys(isShowList).find((key) => isShowList[key])

  const handleFocusList = (name) => {
    Object.keys(isShowList).forEach((key) => {
      isShowList[key] = false
    })
    setIsShowList({ ...isShowList, [name]: true })
  }

  const handlePress = ({ e, cb }) => {
    if (e.key === "Enter") {
      e.preventDefault()
      cb()
    }
  }

  const clearIsShowList = () => {
    return setIsShowList(
      Object.assign(
        {},
        ...Object.keys(isShowList).map((key) => ({ [key]: false }))
      )
    )
  }

  const deleteOptionsValue = (idx) => {
    const name = getShowKey()
    const newOption = {
      name,
      values: options
        .find((item) => item.name === name)
        .values.filter((item, i) => i !== idx),
    }
    setOptions(options.map((item) => (item.name === name ? newOption : item)))
  }
  const deleteOption = (name) => {
    const newShowList = { ...isShowList }
    delete newShowList[name]
    setIsShowList(newShowList)
    setOptions(options.filter((item) => item.name !== name))
  }
  const handleClick = (name) => {
    if (name !== inputValue.brand) {
      setOptions([])
      setInputValue({ brand: name, option: "" })
    }
    setIsShow(false)
  }

  return (
    <Layout title="Добавление опций">
      {!isAdmin ? (
        <AccessDenied />
      ) : (
        <div>
          <ToastContainer />

          <form onSubmit={handleSubmit}>
            <div className={styles.header}>
              <Links home={true} />

              <button className="btn" type="submit">
                Сохранить
              </button>
            </div>
            <div className={styles.content}>
              <div className={styles.content_left}>
                <div
                  className={styles.input}
                  onFocus={() => {
                    clearIsShowList
                    setIsShow(true)
                  }}
                  onBlur={() => setIsShow(false)}
                  tabIndex={0}
                >
                  <label htmlFor="brand">Категория</label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={inputValue.brand}
                    onChange={handleInput}
                    readOnly
                  />
                  <DropDownList
                    isShow={isShow}
                    itemsList={categoriesList}
                    handleClick={handleClick}
                  />
                </div>
                <div className={styles.input}>
                  <label htmlFor="option">Опция</label>
                  <div className={styles.input_button}>
                    <input
                      type="text"
                      id="option"
                      name="option"
                      value={inputValue.option}
                      onChange={handleInput}
                      onKeyPress={(e) => handlePress({ e, cb: addOption })}
                      onFocus={clearIsShowList}
                    />
                    <button
                      type="button"
                      onClick={addOption}
                      title="Добавить опцию"
                    >
                      <FaPlusCircle className={styles.icon_plus} />
                    </button>
                  </div>
                </div>

                {options.length
                  ? options.map((item, i) => (
                      <div
                        key={i}
                        tabIndex={0}
                        onFocus={() => handleFocusList(item.name)}
                      >
                        <div className={styles.input}>
                          <label htmlFor={item.name}>
                            {item.name}
                            <button
                              type="button"
                              title="Удалить опцию"
                              onClick={() => deleteOption(item.name)}
                            >
                              <FaTimes className={styles.icon_delete} />
                            </button>
                          </label>
                          <div className={styles.input_button}>
                            <input
                              type="text"
                              id={item.name}
                              name={item.name}
                              value={inputValue[item.name]}
                              onChange={handleInput}
                              onKeyPress={(e) =>
                                handlePress({
                                  e,
                                  cb: () =>
                                    addOptionValue({
                                      name: item.name,
                                      value: inputValue[item.name],
                                    }),
                                })
                              }
                            />
                            <button
                              type="button"
                              onClick={() =>
                                addOptionValue({
                                  name: item.name,
                                  value: inputValue[item.name],
                                })
                              }
                              title="Добавить значение опции"
                            >
                              <FaPlusCircle className={styles.icon_plus} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  : null}
              </div>

              <div className={styles.content_right}>
                {Object.values(isShowList).some((value) => value) &&
                options.length ? (
                  <>
                    <p>Опция: {getShowKey()}</p>
                    <div className={styles.option_list}>
                      {options
                        .find((item) => item.name === getShowKey())
                        .values.map((item, i) => (
                          <div key={i} className={styles.list_item}>
                            <div>{item}</div>
                            <button
                              type="button"
                              title="Удалить значение опции"
                              onClick={() => deleteOptionsValue(i)}
                            >
                              <FaTimes className={styles.icon_delete} />
                            </button>
                          </div>
                        ))}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </form>
        </div>
      )}
    </Layout>
  )
}

export async function getServerSideProps() {
  const res = await fetch(`${API_URL}/api/categories/brands`)
  const { categories } = await res.json()

  return {
    props: {
      categories,
    },
  }
}
