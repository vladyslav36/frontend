import styles from "@/styles/SelectOptions.module.scss"
import { useEffect, useState } from "react"
import { stringToPrice } from "utils"

export default function SelectOptions({ values, setValues, brand, toast }) {
  const [changedPriceOption, setChangedPriceOption] = useState("")


  const handleChangePrice = ({ name, option, e }) => {
    e.preventDefault()
    setValues({
      ...values,
      options: {
        ...values.options,
        [name]: values.options[name].map((value) =>
          value.value === option ? { ...value, price: e.target.value } : value
        ),
      },
    })
  }
  const formatPrice = ({ name, option, e }) => {
    const { price, error } = stringToPrice(e.target.value)
    if (error) {
      toast.error("Прайс должен быть числом")
      return
    }
    setValues({
      ...values,
      options: {
        ...values.options,
        [name]: values.options[name].map((value) =>
          value.value === option ? { ...value, price } : value
        ),
      },
    })
  }

  const handleCheckbox = ({ name, option, checked, id }) => {
    if (checked) {
      // add option to values.options[name]
      setValues({
        ...values,
        options: {
          ...values.options,
          [name]: [
            ...values.options[name],
            { value: option, price: values.price, isChanged:false },
          ],
        },
      })
    } else {
      // remove option from values.options[name]
      setValues({
        ...values,
        options: {
          ...values.options,
          [name]: values.options[name].filter((item) => item.value !== option),
        },
      })
    }
  }
  // toggle делает так что checkbox ведет себя так что может быть нажата только одна кнопка или ни одной
  const toggleCheck = (e) => {
    const option = e.target.value
    const name = e.target.name
    const checked = e.target.checked
    if (checked) {
      setChangedPriceOption(name)
    } else {
      setChangedPriceOption("")
      setValues({
        ...values,
        options: {
          ...values.options,
          [name]: values.options[name].map((value) => ({
            value: value.value,
            price: values.price,
          })),
        },
      })
    }
  }
  console.log(values.options)
  return (
    <div className={styles.options_container}>
      {Object.keys(brand.options).length
        ? Object.keys(brand.options).map((item, i) => (
            <div key={i}>
              <div className={styles.header_options}>
                <h3>{item}</h3>
                <div className={styles.custom_radio}>
                  <input
                    type="checkbox"
                    id={item}
                    name={item}
                    value={item}
                    onChange={toggleCheck}
                    checked={item === changedPriceOption ? true : false}
                  />
                  <label htmlFor={item}>Менять прайс</label>
                </div>
              </div>

              <div className={styles.flex_block}>
                {brand.options[item].sort().map((optionValue, i) => (
                  <div key={i} className={styles.custom_checkbox}>
                    <input
                      type="checkbox"
                      id={`${item}${optionValue}`}
                      name={item}
                      value={optionValue}
                      onChange={(e) =>
                        handleCheckbox({
                          name: item,
                          option: optionValue,
                          checked: e.target.checked,
                          id: e.target.id,
                        })
                      }
                      checked={values.options[item].some(
                        (val) => val.value === optionValue
                      )}
                    />
                    <label htmlFor={`${item}${optionValue}`} tabIndex={0}>
                      {optionValue}

                      {item === changedPriceOption &&
                      values.options[item].some(
                        (val) => val.value === optionValue
                      ) ? (
                        <div className={styles.option_price}>
                          <input
                            type="text"
                            value={
                              values.options[item].find(
                                (val) => val.value === optionValue
                              ).price
                            }
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
                      ) : null}
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
