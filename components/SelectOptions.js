import styles from "@/styles/Form.module.css"
import { useState } from "react"
import { stringToPrice } from "utils"

export default function SelectOptions({ brands, brandId, values, setValues,toast }) {
  const { colors, sizes, heights } = brands.find((item) => item._id === brandId)
  const [changePriceOption, setChangePriceOption] = useState("")

  const clearRestOptions = (options) => {
    
    options.forEach(option=>values[option].forEach(item=>item.price=''))
  }
  const findOption = ({ name, option }) => {
    return values[name].find((item) => item.name === option)
  }
  const handleClick = ({ name, option }) => {
    const isExist = findOption({ name, option })

    if (isExist) {
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

  const handleChangePrice = ({ name, option, e }) => {
    e.preventDefault()  
   
    setValues({
      ...values,
      [name]: values[name].map((item) =>
        item.name === option ? { name: option, price:e.target.value } : item
      ),
    })
  }

  const formatPrice = ({ name, option,value }) => {
    let { price, error } = stringToPrice(value)
    if (error) {
      price = ''
      toast.error('Цена должна быть числом')
    }
    setValues({
      ...values,
      [name]: values[name].map((item) =>
        item.name === option ? { name: option, price } : item
      ),
    })
  }
  
  return (
    <div>
      {colors.length ? (
        <div>
          <div className={styles.header_options}>
            <h3>Цвета</h3>
            <input
              type="radio"
              id="colors"
              name="changePrice"
              value="colors"
              onChange={(e) => {
                setChangePriceOption(e.target.value)                
              }}
            />
            <label htmlFor="colors">Менять прайс</label>
          </div>

          <div className={styles.flex_block}>
            {colors.map((item, i) => (
              <div className={styles.flex_block_item} key={i}>
                <div
                  className={
                    findOption({ name: "colors", option: item.name })
                      ? styles.option + " " + styles.active_item
                      : styles.option
                  }
                  onClick={() =>
                    handleClick({ name: "colors", option: item.name })
                  }
                >
                  {item.name}
                </div>
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
                          clearRestOptions(['sizes','heights'])
                        }                          
                        }
                      />
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {sizes.length ? (
        <div>
          <div className={styles.header_options}>
            <h3>Размеры</h3>
            <input
              type="radio"
              id="sizes"
              name="changePrice"
              value="sizes"
              onChange={(e) => {
                setChangePriceOption(e.target.value)
                
              }}
            />
            <label htmlFor="sizes">Менять прайс</label>
          </div>
          <div className={styles.flex_block}>
            {sizes.map((item, i) => (
              <div className={styles.flex_block_item} key={i}>
                <div
                  className={
                    findOption({ name: "sizes", option: item.name })
                      ? styles.option + " " + styles.active_item
                      : styles.option
                  }
                  onClick={() =>
                    handleClick({ name: "sizes", option: item.name })
                  }
                >
                  {item.name}
                </div>
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
                        clearRestOptions(['colors','heights'])
                        }                          
                        }
                      />
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {heights.length ? (
        <div>
          <div className={styles.header_options}>
            <h3>Роста</h3>
            <input
              type="radio"
              id="heights"
              name="changePrice"
              value="heights"
              onChange={(e) => {
                setChangePriceOption(e.target.value)
                
              }}
            />
            <label htmlFor="heights">Менять прайс</label>
          </div>
          <div className={styles.flex_block}>
            {heights.map((item, i) => (
              <div className={styles.flex_block_item} key={i}>
                <div
                  className={
                    findOption({ name: "heights", option: item.name })
                      ? styles.option + " " + styles.active_item
                      : styles.option
                  }
                  onClick={() =>
                    handleClick({ name: "heights", option: item.name })
                  }
                >
                  {item.name}
                </div>
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
                          clearRestOptions(['colors','sizes'])
                        }                          
                        }
                      />
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
