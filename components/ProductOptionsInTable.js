import React from 'react'
import ProductPriceBlock from './ProductPriceBlock'
import styles from '@/styles/ProductOptionsInTable.module.scss'

export default function ProductOptionsInTable({ crumbs, level, maxLevel, optionValues, setValues,product,values }) {
  level++
  return (
    <>
      {Object.keys(optionValues).map((item) => (
        <div key={level + [...crumbs, item].join()}>
          {level === maxLevel ? (
            <div
              className={styles.last_option+' '+'option'}
              style={{ paddingLeft: level * 10 + "px" }}
              key={level + crumbs.toString()}
            >
              <div>{item}</div>

              <ProductPriceBlock
                arr={[...crumbs, item]}
                product={product}
                setValues={setValues}
                values={values}
              />
            </div>
          ) : (
            <>
              <div
                className="option"
                style={{ paddingLeft: level * 10 + "px" }}
              >
                {item}{" "}
              </div>
              <ProductOptionsInTable
                level={level}
                maxLevel={maxLevel}
                crumbs={[...crumbs, item]}
                product={product}
                  setValues={setValues}
                  values={values}
                optionValues={optionValues[item]}
              />
            </>
          )}
        </div>
      ))}
    </>
  )
}
