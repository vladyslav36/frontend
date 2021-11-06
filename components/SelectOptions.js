import styles from "@/styles/Form.module.css"
import { useState } from "react"
import { stringToPrice } from "utils"

export default function SelectOptions({
  brands,
  brandId,
  values,
  setValues,
  toast,
}) {
  const { colors, sizes, heights } = brands.find((item) => item._id === brandId)
  const [changePriceOption, setChangePriceOption] = useState("")

  const clearRestOptions = (options) => {
    options.forEach((option) =>
      values[option].forEach((item) => (item.price = ""))
    )
  }
  const findOption = ({ name, option }) => {
    return values[name].find((item) => item.name === option)
  }
  

  const handleChangePrice = ({ name, option, e }) => {
    e.preventDefault()

    setValues({
      ...values,
      [name]: values[name].map((item) =>
        item.name === option ? { name: option, price: e.target.value } : item
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
      [name]: values[name].map((item) =>
        item.name === option ? { name: option, price } : item
      ),
    })
  }
  const handleCheckbox = ({ name, option, checked }) => {
    
    if (!checked) {
      setValues({
        ...values,
        [name]: values[name].filter((item) => item.name !== option),
      })
    } else {
      setValues({
        ...values,
        [name]: [...values[name], { name: option, price: "" }],
      })
    }
  }
  return (
    <div>
      {colors.length ? (
        <div>
          <div className={styles.header_options}>
            <h3>Цвета</h3>
            <div className={styles.custom_radio}>
              <input
                type="radio"
                id="colors"
                name="changePrice"
                value="colors"
                onChange={(e) => {
                  setChangePriceOption(e.target.value)
                }}
                checked={changePriceOption === "colors"}
              />
              <label htmlFor="colors">Менять прайс</label>
            </div>
            <button type='button' onClick={()=>setChangePriceOption('')}>Сброс</button>
          </div>

          <div className={styles.flex_block}>
            {colors.map((item, i) => (
              <div key={i} className={styles.custom_checkbox}>
                <input
                  type="checkbox"
                  id={item.name}
                  name="colors"
                  value={item.name}
                  onChange={(e) =>
                    handleCheckbox({
                      name: "colors",
                      option: e.target.value,
                      checked: e.target.checked,
                    })
                  }
                />
                <label htmlFor={item.name}>
                  {item.name}
                  {changePriceOption === "colors" &&
                    findOption({ name: "colors", option: item.name }) && (
                      <div className={styles.option_price} tabIndex={0}>
                        <input
                          type="text"
                          value={
                            values.colors.find(
                              (color) => color.name === item.name
                            ).price
                          }
                          onChange={(e) =>
                            handleChangePrice({
                              name: "colors",
                              option: item.name,
                              e,
                            })
                          }
                          onBlur={(e) => {
                            formatPrice({
                              name: "colors",
                              option: item.name,
                              value: e.target.value,
                            })
                            clearRestOptions(["sizes", "heights"])
                          }}
                        />
                      </div>
                    )}
                </label>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {sizes.length ? (
        <div>
          <div className={styles.header_options}>
            <h3>Размеры</h3>
            <div className={styles.custom_radio}>
              <input
                type="radio"
                id="sizes"
                name="changePrice"
                value="sizes"
                onChange={(e) => {
                  setChangePriceOption(e.target.value)
                }}
                checked={changePriceOption === "sizes"}
              />
              <label htmlFor="sizes">Менять прайс</label>
            </div>
          </div>

          <div className={styles.flex_block}>
            {sizes.map((item, i) => (
              <div key={i} className={styles.custom_checkbox}>
                <input
                  type="checkbox"
                  id={item.name}
                  name="sizes"
                  value={item.name}
                  onChange={(e) =>
                    handleCheckbox({
                      name: "sizes",
                      option: e.target.value,
                      checked: e.target.checked,
                    })
                  }
                />
                <label htmlFor={item.name}>
                  {item.name}
                  {changePriceOption === "sizes" &&
                    findOption({ name: "sizes", option: item.name }) && (
                      <div className={styles.option_price} tabIndex={0}>
                        <input
                          type="text"
                          value={
                            values.sizes.find((size) => size.name === item.name)
                              .price
                          }
                          onChange={(e) =>
                            handleChangePrice({
                              name: "sizes",
                              option: item.name,
                              e,
                            })
                          }
                          onBlur={(e) => {
                            formatPrice({
                              name: "sizes",
                              option: item.name,
                              value: e.target.value,
                            })
                            clearRestOptions(["colors", "heights"])
                          }}
                        />
                      </div>
                    )}
                </label>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {heights.length ? (
        <div>
          <div className={styles.header_options}>
            <h3>Роста</h3>
            <div className={styles.custom_radio}>
              <input
                type="radio"
                id="heights"
                name="changePrice"
                value="heights"
                onChange={(e) => {
                  setChangePriceOption(e.target.value)
                }}
                checked={changePriceOption === "heights"}
              />
              <label htmlFor="heights">Менять прайс</label>
            </div>
          </div>

          <div className={styles.flex_block}>
            {heights.map((item, i) => (
              <div key={i} className={styles.custom_checkbox}>
                <input
                  type="checkbox"
                  id={item.name}
                  name="heights"
                  value={item.name}
                  onChange={(e) =>
                    handleCheckbox({
                      name: "heights",
                      option: e.target.value,
                      checked: e.target.checked,
                    })
                  }
                />
                <label htmlFor={item.name}>
                  {item.name}
                  {changePriceOption === "heights" &&
                    findOption({ name: "heights", option: item.name }) && (
                      <div className={styles.option_price} tabIndex={0}>
                        <input
                          type="text"
                          value={
                            values.heights.find(
                              (height) => height.name === item.name
                            ).price
                          }
                          onChange={(e) =>
                            handleChangePrice({
                              name: "heights",
                              option: item.name,
                              e,
                            })
                          }
                          onBlur={(e) => {
                            formatPrice({
                              name: "heights",
                              option: item.name,
                              value: e.target.value,
                            })
                            clearRestOptions(["colors", "sizes"])
                          }}
                        />
                      </div>
                    )}
                </label>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
