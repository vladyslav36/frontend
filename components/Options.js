
import AuthContext from "@/context/AuthContext"
import { useContext,  useState } from "react"
import styles from "@/styles/OptionForm.module.css"
import "react-toastify/dist/ReactToastify.css"
import { toast, ToastContainer } from "react-toastify"
import {  FaPlusCircle, FaTimes } from "react-icons/fa"




export default function Options({ values, setValues }) {  
  const [inputValue, setInputValue] = useState({    
    option: "",
  })
  
  // example options.color.values.red.price
  const [activeOption, setActiveOption] = useState("")
  // activeOption-опция, значения которой надо показывать
  const [isShow, setIsShow] = useState(false)
  // dropdown list for categories

 
  const handleInput = async (e) => {
    e.preventDefault()

    const { name, value } = e.target
    const ucValue = value.charAt(0).toUpperCase() + value.slice(1)
    setInputValue({ ...inputValue, [name]: ucValue })
  }

  const addOption = () => {
    if (Object.keys(values.options).length === 4) {
      toast.warning("Не рекомендуется делать кол-во опций больше 4")
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
      setValues({...values,options:{...values.options, [inputValue.option]: { values: {}, isChangePrice: false }}       
      })
      setActiveOption("")
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
    const newOptions = { ...values.options }
    newOptions[name].values[value] = { price: "", checked: false }

    setValues({...values,options:newOptions})

    setInputValue({ ...inputValue, [name]: "" })
  }

  const handlePress = ({ e, cb }) => {
    if (e.key === "Enter") {
      e.preventDefault()
      cb()
    }
  }

  const deleteOptionsValue = (value) => {
    const newOptions = { ...values.options }
    delete newOptions[activeOption].values[value]
    setValues({ ...values, options: { ...newOptions }})
  }
  const deleteOption = (name) => {
    const newInputValue = { ...inputValue }
    delete newInputValue[name]
    const newOptions = { ...values.options }
    delete newOptions[name]
    setActiveOption("")
    setInputValue({ ...newInputValue })
    setValues({ ...values, options: { ...newOptions } })
  }  
  
  return (   
        <div>
          <ToastContainer />            
            <div className={styles.content}>
              <div className={styles.content_left}>
                <div
                  className={styles.input}
                  onFocus={() => {
                    setActiveOption("")
                    setIsShow(true)
                  }}
                  onBlur={() => setIsShow(false)}
                  tabIndex={0}
                >
                  
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
                      onFocus={() => setActiveOption("")}
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

                {Object.keys(values.options).length
                  ? Object.keys(values.options).map((item, i) => (
                      <div
                        key={i}
                        tabIndex={0}
                        onFocus={() => setActiveOption(item)}
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
                      {Object.keys(values.options[activeOption].values).map(
                        (item, i) => (
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
                        )
                      )}
                    </div>
                  </>
                ) : null}
              </div>
            </div>          
        </div>
      
  )
}


