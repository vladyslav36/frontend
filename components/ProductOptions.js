import styles from "@/styles/ProductOptions.module.scss"
import { getCurrencySymbol } from "utils"

export default function ProductOptions({
  options,
  currencyValue,
  values,
  setValues,
}) {
  const handleClick = ({ option, value }) => {
    setValues({ ...values, [option]: value })
  }

  return (
    <div className={styles.options_container}>
      {Object.keys(options).map((option, i) => (
        <div key={i}>
          <div className={styles.option}>{option}</div>
          <div className={styles.options_wrapper}>
            {Object.keys(options[option])
              .sort()
              .map((value, i) => (
                <div
                  key={i}
                  className={
                    styles.value +
                    " " +
                    (values[option] === value ? styles.active : "")
                  }
                  onClick={() => handleClick({ option, value })}
                >
                  
                    <span>{value}{' '} /</span>

                    <span
                      className={
                        (options[option][value].isChanged
                          ? styles.option_price
                          : styles.price) +
                        " " +
                        (values[option] === value ? styles.active_price : "")
                      }
                    >
                      {options[option][value].price}
                      {getCurrencySymbol(currencyValue)}
                    </span>
                  </div>
                
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}
