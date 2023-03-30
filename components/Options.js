import {   useState } from "react"
import styles from "@/styles/OptionForm.module.scss"
import "react-toastify/dist/ReactToastify.css"
import { toast, ToastContainer } from "react-toastify"





export default function Options({ values, setValues }) {  
  
  const initialOptions = Object.assign({}, ...Object.keys(values.options).map(option => ({ [option]: '' })))  
  const [inputValue, setInputValue] = useState({    
    option: "", ...initialOptions
  })
  
  // example options.color.values.red.price
  const [activeOption, setActiveOption] = useState("")
  // activeOption-опция, значения которой надо показывать
 
  const handleInputOption = async (e) => {
    e.preventDefault()

    const { name, value } = e.target
    const ucValue = value.charAt(0).toUpperCase() + value.slice(1)
    setInputValue({ ...inputValue, [name]: ucValue })
  }
  const handleInputValue = async (e) => {
    e.preventDefault()

    const { name, value } = e.target
    
    setInputValue({ ...inputValue, [name]:value })
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
      setValues({...values,options:{...values.options, [inputValue.option]: []}       
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
    setValues({...values,options:{...values.options,[name]:[...values.options[name],value]}})
    setInputValue({ ...inputValue, [name]: "" })
  }

  const handlePress = ({ e, cb }) => {
    if (e.key === "Enter") {
      e.preventDefault()
      cb()
    }
  }

  const deleteOptionsValue = (i) => {   
    setValues({ ...values, options: { ...values.options,[activeOption]: values.options[activeOption].filter((item, j) => i !== j) } })
  }
  const deleteOption = (name) => {
    const { [name]: deletedField, ...newInputValue } = inputValue
    const { [name]: deletedField2, ...newOptions }=values.options    
    setActiveOption("")
    setInputValue(newInputValue)
    setValues({ ...values, options: newOptions })
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
            }}            
            tabIndex={0}
          ></div>
          <div className={styles.input}>
            <label htmlFor="option">Опция</label>
            <div className={styles.input_button}>
              <input
                type="text"
                id="option"
                name="option"
                value={inputValue.option}
                onChange={handleInputOption}
                onKeyDown={(e) => handlePress({ e, cb: addOption })}
                onFocus={() => setActiveOption("")}
              />
              <button type="button" onClick={addOption} title="Добавить опцию">
                <div className={styles.icon_plus}>
                  <i className="fa-solid fa-circle-plus"></i>
                </div>
              </button>
            </div>
          </div>

          {Object.keys(values.options).length
            ? Object.keys(values.options).map((item, i) => (
                <div key={i} tabIndex={0} onFocus={() => setActiveOption(item)}>
                  <div className={styles.input}>
                    <label htmlFor={item}>
                      {item}
                      <button
                        type="button"
                        title="Удалить опцию"
                        onClick={() => deleteOption(item)}
                      >
                        <div className={styles.icon_delete}>
                          <i className="fa-solid fa-xmark"></i>
                        </div>
                      </button>
                    </label>
                    <div className={styles.input_button}>
                      <input
                        type="text"
                        id={item}
                        name={item}
                        value={inputValue[item]}
                        onChange={handleInputValue}
                        onKeyDown={(e) =>
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
                        <div className={styles.icon_plus}>
                          <i className="fa-solid fa-circle-plus"></i>
                        </div>
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
                {values.options[activeOption].map(
                  (item, i) => (
                    <div key={i} className={styles.list_item}>
                      <div>{item}</div>
                      <button
                        type="button"
                        title="Удалить значение опции"
                        onClick={() => deleteOptionsValue(i)}
                      >
                        <div className={styles.icon_delete}>
                          <i className="fa-solid fa-xmark"></i>
                        </div>
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


