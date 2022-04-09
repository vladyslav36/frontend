import { getCurrencySymbol } from "utils"
import styles from "@/styles/ProductOptions.module.css"
import { FaPlus, FaMinus } from "react-icons/fa"

export default function ProductOptions({
  options,
  currencyValue,
  values,
  setValues,
  toast,
}) {
  
  const handleClick = ({ option, value }) => {
    setValues({ ...values, [option]: value })
  }

  const decQnt = () => {
    if (Number.isInteger(+values.qnt) && +values.qnt > 0) {
      setValues({ ...values, qnt: "" + (+values.qnt - 1) })
    } else {
      toast.warning("Количество должно быть целым числом больше нуля")
    }
  }
  const incQnt = () => {
    if (Number.isInteger(+values.qnt) && +values.qnt >= 0) {
      setValues({ ...values, qnt: "" + (+values.qnt + 1) })
    } else {
      toast.warning("Количество должно быть целым числом больше нуля")
    }
  }
  return (
    <div className={styles.options_container}>
      {Object.keys(options).map((option, i) => (
        <div key={i}>
          <div className={styles.option}>{option}</div>
          <div className={styles.options_wrapper}>
            {Object.keys(options[option].values).map((value, i) =>
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
                    <p>
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
                    </p>
                  ) : (
                    value
                  )}
                </div>
              ) : null
            )}
          </div>
        </div>
      ))}
      <div>
        <div className={styles.counter_wrapper}>
          <FaMinus className={styles.icons} onClick={decQnt} />
          <input
            type="text"
            className={styles.input}
            value={values.qnt}
            onChange={(e) => setValues({ ...values, qnt: e.target.value })}
          />{" "}
          <FaPlus className={styles.icons} onClick={incQnt} />
        </div>
      </div>
    </div>
  )
}
