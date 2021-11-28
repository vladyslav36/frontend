import styles from "@/styles/Form.module.css"

import { stringToPrice } from "utils"

export default function SelectOptions({
  brandOptions,
  values,
  setValues,
  toast,
}) {
  const handleChangePrice = ({ name, option, e }) => {
    e.preventDefault()

    setValues({
      ...values,
      options: values.options.map((opt) =>
        opt.name !== name
          ? opt
          : {
              ...opt,
              values: opt.values.map((value) =>
                value.name !== option
                  ? value
                  : { ...value, price: e.target.value }
              ),
            }
      ),
    })
  }
  const formatPrice = ({ name, option, value }) => {
    let { price, error } = stringToPrice(value)
    if (error) {
      price = ""
      toast.error("Цена должна быть числом")
    }
    setValues({
      ...values,
      options: values.options.map((opt) =>
        opt.name !== name
          ? opt
          : {
              ...opt,
              values: opt.values.map((value) =>
                value.name !== option ? value : { ...value, price }
              ),
            }
      ),
    })
  }
  const handleCheckbox = ({ name, option, checked }) => {
    if (!checked) {
      // Удаление значения опции /{name:red,price:''} из values.options
      setValues({
        ...values,
        options: values.options.map((item) =>
          item.name === name
            ? {
                ...item,
                values: item.values.filter((value) => value.name !== option),
              }
            : item
        ),
      })
    } else {
      // Добавление опции /{name:red,price:''}/ в values.options
      setValues({
        ...values,
        options: values.options.map((item) =>
          item.name === name
            ? {
                ...item,
                values: [...item.values, { name: option, price: "" }],
              }
            : item
        ),
      })
    }
  }
  // toggle делает так что checkbox ведет себя и как radio и как checkbox
  const toggleCheck = (e) => {
    const value = e.target.value
    const checked = e.target.checked

    setValues({
      ...values,
      options: values.options.map((option) =>
        option.name === value
          ? { ...option, isChangePrice: checked }
          : {
              ...option,
              isChangePrice: false,
              values: option.values.map((value) => ({ ...value, price: "" })),
            }
      ),
    })
  }

  return (
    <div className={styles.options_container}>
      {Object.keys(brandOptions).length
        ? brandOptions.options.map((item, i) => (
            <div key={i}>
              <div className={styles.header_options}>
                <h3>{item.name}</h3>
                <div className={styles.custom_radio}>
                  <input
                    type="checkbox"
                    id={item.name}
                    name="changePrice"
                    value={item.name}
                    onChange={toggleCheck}
                    checked={
                      values.options.find((option) => option.name === item.name)
                        .isChangePrice
                    }
                  />
                  <label htmlFor={item.name}>Менять прайс</label>
                </div>
              </div>

              <div className={styles.flex_block}>
                {item.values.map((optionValue, i) => (
                  <div key={i} className={styles.custom_checkbox}>
                    <input
                      type="checkbox"
                      id={optionValue}
                      name={item.name}
                      value={optionValue}
                      onChange={(e) =>
                        handleCheckbox({
                          name: item.name,
                          option: e.target.value,
                          checked: e.target.checked,
                        })
                      }
                      checked={values.options
                        .find((option) => option.name === item.name)
                        .values.some((value) => value.name === optionValue)}
                    />
                    <label htmlFor={optionValue} tabIndex={0}>
                      {optionValue}

                      {values.options.length &&
                        values.options.find(
                          (option) => option.name === item.name
                        ).isChangePrice &&
                        values.options
                          .find((option) => option.name === item.name)
                          .values.find(
                            (value) => value.name === optionValue
                          ) && (
                          <div className={styles.option_price}>
                            <input
                              type="text"
                              value={
                                values.options
                                  .find((option) => option.name === item.name)
                                  .values.find(
                                    (value) => value.name === optionValue
                                  ).price
                              }
                              onChange={(e) =>
                                handleChangePrice({
                                  name: item.name,
                                  option: optionValue,
                                  e,
                                })
                              }
                              onBlur={(e) => {
                                formatPrice({
                                  name: item.name,
                                  option: optionValue,
                                  value: e.target.value,
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
