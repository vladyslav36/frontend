import styles from "@/styles/Form.module.css"

import { stringToPrice } from "utils"

export default function SelectOptions({ values, setValues, toast }) {

  const handleChangePrice = ({ name, option, e }) => {
    e.preventDefault()
    
   const newValues={...values}
    newValues.options[name].values[option].price = e.target.value
    setValues(newValues)
  }
  const formatPrice = ({ name, option, e }) => {
    const { price, error }=stringToPrice(e.target.value)
    if (error) {
      toast.error('Прайс должен быть числом')
      return
    }
    const newValues = { ...values }
    newValues.options[name].values[option].price = price
    setValues(newValues)
  }
  
  const handleCheckbox = ({ name, option, checked }) => {
    
    const newValues = { ...values }
    newValues.options[name].values[option].checked = checked
    setValues(newValues)
  }
  // toggle делает так что checkbox ведет себя так что может быть нажата только одна кнопка или ни одной
  const toggleCheck = (e) => {
    const option = e.target.value
    const checked = e.target.checked
    
    if (checked) {
      const restOptions = Object.keys(values.options).filter(item => item !== option)
      const newValues = { ...values }
      newValues.options[option].isChangePrice = checked
      restOptions.forEach(item=>newValues.options[item].isChangePrice=false)
      setValues(newValues)
    } else {
      const newValues = { ...values }
      newValues.options[option].isChangePrice = checked
      setValues(newValues)
    }
    
  }

  return (
    <div className={styles.options_container}>
      {Object.keys(values.options).length
        ? Object.keys(values.options).map((item, i) => (
            <div key={i}>
              <div className={styles.header_options}>
                <h3>{item}</h3>
                <div className={styles.custom_radio}>
                  <input
                    type="checkbox"
                    id={item}
                    name='changePrice'
                    value={item}
                    onChange={toggleCheck}
                    checked={values.options[item].isChangePrice}
                  />
                  <label htmlFor={item}>Менять прайс</label>
                </div>
              </div>

              <div className={styles.flex_block}>
                {Object.keys(values.options[item].values)
                  .sort()
                  .map((optionValue, i) => (
                    <div key={i} className={styles.custom_checkbox}>
                      <input
                        type="checkbox"
                        id={optionValue}
                        name={item}
                        value={optionValue}
                        onChange={(e) =>
                          handleCheckbox({
                            name: item,
                            option: e.target.value,
                            checked: e.target.checked,
                          })
                        }
                        checked={
                          values.options[item].values[optionValue].checked
                        }
                      />
                      <label htmlFor={optionValue} tabIndex={0}>
                        {optionValue}

                        {values.options[item].isChangePrice && values.options[item].values[optionValue].checked &&(
                          <div className={styles.option_price}>
                            <input
                              type="text"
                              value={values.options[item].values[optionValue].price}
                              onChange={(e) =>
                                handleChangePrice({
                                  name: item,
                                  option: optionValue,
                                  e,
                                })
                              }
                              onBlur={(e) => {
                                formatPrice({
                                  name: item,
                                  option: optionValue,
                                  e,
                                })
                              }}
                            />
                          </div>
                        )}
                      </label>
                    </div>
                  ))}
              </div>
            </div>
          ))
        : null}
    </div>
  )
}
