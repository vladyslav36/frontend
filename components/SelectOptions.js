import styles from "@/styles/SelectOptions.module.scss"

export default function SelectOptions({ values, setValues, brand }) {
  const handleCheckbox = ({ name, option, checked }) => {
    if (checked) {
      // add option to values.options[name]
      setValues({
        ...values,
        ownOptions: {
          ...values.ownOptions,
          [name]: [...values.ownOptions[name], option],
        },
      })
    } else {
      setValues({
        ...values,
        ownOptions: {
          ...values.ownOptions,
          [name]: values.ownOptions[name].filter((value) => value !== option),
        },
      })
    }
  }

  return (
    <div className={styles.container}>
      {Object.keys(brand.options).length
        ? Object.keys(brand.options).map((item, i) => (
            <div key={i}>
              <div className={styles.flex_block}>
                <h4>{item}:</h4>
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
                        })
                      }
                      checked={values.ownOptions[item].includes(optionValue)}
                    />
                    <label htmlFor={`${item}${optionValue}`} tabIndex={0}>
                      {optionValue}
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
