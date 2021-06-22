import styles from "@/styles/Form.module.css"


export default function SelectOptions({ brands, brandId,values,setValues }) {
  const { colors, sizes, heights } = brands.find((item) => item._id === brandId)
  
  
  const findOption = ({ name, option }) => {
    return values[name].find(item => item === option)
  }
  const handleClick = ({ name, option }) => {
    const isExist = findOption({name,option})
    
    if (isExist) {
      setValues({ ...values, [name]: values[name].filter(item => item !== option) })
      
    } else {
      setValues({ ...values, [name]: [...values[name], option] })
     
    }
  }
 
  return (
    <div>
      {colors.length ? (
        <div>
          <h3>Цвета</h3>
          <div className={styles.flex_block}>
            {colors.map((color, i) => (
              <div
                className={
                  findOption({ name: "colors", option: color })
                    ? styles.option_active
                    : null
                }
                key={i}
                onClick={() =>
                  handleClick({ name: "colors", option: color })
                }
              >
                {color}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {sizes.length ? (
        <div>
          <h3>Размеры</h3>
          <div className={styles.flex_block}>
            {sizes.map((size, i) => (
              <div
                className={
                  findOption({ name: "sizes", option: size })
                    ? styles.option_active
                    : null
                }
                key={i}
                onClick={() => handleClick({ name: "sizes", option: size })}
              >
                {size}
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {heights.length ? (
        <div>
          <h3>Роста</h3>
          <div className={styles.flex_block}>
            {heights.map((height, i) => (
              <div
                className={
                  findOption({ name: "heights", option: height })
                    ? styles.option_active
                    : null
                }
                key={i}
                onClick={() => handleClick({ name: "heights", option: height })}
              >
                {height}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
