import React from "react"
import styles from "@/styles/OptionInTable.module.scss"
import InputPriceBlock from "./InputPriceBlock"

export default function OptionInTable({
  level,
  maxLevel,
  crumbs,
  optionValues,
  values,
  setValues,
}) {
  level++
  return (
    <>
      {Object.keys(optionValues).map((item, key) => (
        <div key={level + [...crumbs, item].join()}>
          {level === maxLevel ? (
            <div
              className={styles.last_option}
              
              style={{ paddingLeft: level * 50 + "px" }}
              key={level + crumbs.toString()}
            >
              <div>{item}</div>

              <InputPriceBlock
                arr={[...crumbs, item]}
                values={values}
                setValues={setValues}
              />
            </div>
          ) : (
            <>
              <div
                className='option'
                style={{ paddingLeft: level * 50 + "px" }}
              >
                {item}{" "}
              </div>
              <OptionInTable
                level={level}
                maxLevel={maxLevel}
                crumbs={[...crumbs, item]}
                values={values}
                setValues={setValues}
                optionValues={optionValues[item]}
              />
            </>
          )}
        </div>
      ))}
    </>
  )
}
