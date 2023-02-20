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
            {Object.keys(options[option].values).sort().map((value, i) =>
              options[option].values[value].checked ? (
                <div
                  key={i}
                  className={
                    styles.value +
                    " " +
                    (values[option] === value ? styles.active : "")
                  }
                  onClick={() => handleClick({ option, value })}
                >
                  {options[option].values[value].price ? (
                    <div>
                      {value} /{" "}
                      <span
                        className={
                          styles.option_price +
                          " " +
                          (values[option] === value ? styles.active_price : "")
                        }
                      >
                        {options[option].values[value].price}{" "}
                        {getCurrencySymbol(currencyValue)}
                      </span>
                    </div>
                  ) : (
                      <p>{value}</p> 
                  )}
                </div>
              ) : null
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
