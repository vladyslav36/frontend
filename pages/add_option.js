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

  const [options, setOptions] = useState({})
  // example options.color.values.red.price  
  const [activeOption, setActiveOption] = useState('')
  // activeOption-опция, значения которой надо показывать
  const [isShow, setIsShow] = useState(false)
  // dropdown list for categories

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!Object.keys(options).length) {
      toast.warning('Ни введена ни одна опция')
      return
    }
    let error=false
    Object.keys(options).forEach(option => {
      
      if (!Object.keys(options[option].values).length) {
        toast.warning('Опция введена без значений')
        error=true
      }
      
    })
    if (error) return

    const value = {
      name: inputValue.brand,
      brandId: categories.find((item) => item.name === inputValue.brand)._id,
      options: options,
    }
    
    const res = await fetch(`${API_URL}/api/options`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(value),
    })
     const data=await res.json()
    
    if (!res.ok) {
      toast.error(data.message)
    } else {
      toast.success("Опции успешно сохранены")
      setActiveOption('')
      setOptions({})
      setInputValue({ brand: "", option: "" })
    }
  }
  const handleInput = async (e) => {
    e.preventDefault()

    const { name, value } = e.target
    const ucValue=value.charAt(0).toUpperCase()+value.slice(1)
    setInputValue({ ...inputValue, [name]: ucValue })
    
  }

  const addOption = () => {
    if (Object.keys(options).length === 4) {
      toast.warning('Не рекомендуется делать кол-во опций больше 4')
      return
    }
    const elem = document.getElementById("option")
    elem.focus()
    if (!inputValue.option.trim()) {
      toast.error("Заполните поле опция")
      return
    }
    const keys = Object.keys(inputValue)
    const isRepeat = keys.find((item) => item === inputValue.option)
    if (!isRepeat) {
      setInputValue({ ...inputValue, [inputValue.option]: "", option: "" })
      setOptions({ ...options, [inputValue.option]: { values: {},isChangePrice:false} })     
      setActiveOption('')
    } else {
      toast.error("Такая опция уже существует или зарезервирована")
    }
  }

  const addOptionValue = ({ name, value }) => {
    if (!value.trim()) {
      toast.error("Заполните поле значение опции")
      return
    }
    const elem = document.getElementById(name)
    elem.focus()
    const newOptions = { ...options }
    newOptions[name].values[value] = {price:'',checked:false}
    
    setOptions(newOptions)
    
    setInputValue({ ...inputValue, [name]: "" })
  }
  

  const handlePress = ({ e, cb }) => {
    if (e.key === "Enter") {
      e.preventDefault()
      cb()
    }
  }

  const deleteOptionsValue = (value) => {
    const newOptions = { ...options }
    delete newOptions[activeOption].values[value]
    setOptions({...newOptions})
  }
  const deleteOption = (name) => {
    
    const newInputValue = { ...inputValue }
    delete newInputValue[name]
    const newOptions = { ...options }
    delete newOptions[name]
    setActiveOption('')
    setInputValue({...newInputValue})    
    setOptions({...newOptions})
  }
  
  const handleClick = (name) => {
    if (name !== inputValue.brand) {
      setOptions({})
      setInputValue({ brand: name, option: "" })
    }
    setIsShow(false)
  }
console.log(options)
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
                    setActiveOption('')
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
                        onFocus={() => setActiveOption('')}
                        
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

                {Object.keys(options).length
                  ?Object.keys(options).map((item, i) => (
                      <div
                        key={i}
                        tabIndex={0}
                        onFocus={()=>setActiveOption(item)}
                      >
                        <div className={styles.input}>
                          <label htmlFor={item}>
                            {item}
                            <button
                              type="button"
                              title="Удалить опцию"
                              onClick={() => deleteOption(item)}
                            >
                              <FaTimes className={styles.icon_delete} />
                            </button>
                          </label>
                          <div className={styles.input_button}>
                            <input
                              type="text"
                              id={item}
                              name={item}
                              value={inputValue[item]}
                              onChange={handleInput}
                              onKeyPress={(e) =>
                                handlePress({
                                  e,
                                  cb: () =>
                                    addOptionValue({
                                      name: item,
                                      value: inputValue[item],
                                    }),
                                })
                              }
                            />
                            <button
                              type="button"
                              onClick={() =>
                                addOptionValue({
                                  name: item,
                                  value: inputValue[item],
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
                {activeOption ? (
                  <>
                    <p>Опция: {activeOption}</p>
                    <div className={styles.option_list}>
                      {Object.keys(options[activeOption].values)
                        .map((item, i) => (
                          <div key={i} className={styles.list_item}>
                            <div>{item}</div>
                            <button
                              type="button"
                              title="Удалить значение опции"
                              onClick={() => deleteOptionsValue(item)}
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
