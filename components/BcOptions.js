import React, { useEffect, useRef, useState } from "react"
import styles from "@/styles/BcOptions.module.scss"
import {
  bcPricesToOptions,
  copyBarcods,
  optionsToBarcods,
  stringToPrice,
} from "utils"
import { GiCheckMark } from "react-icons/gi"
import {
  FaAngleDoubleUp,
  FaArrowAltCircleLeft,
  FaChevronCircleUp,
  FaLongArrowAltRight,
  FaSave,
} from "react-icons/fa"
import "react-toastify/dist/ReactToastify.css"
import { toast, ToastContainer } from "react-toastify"
import { API_URL } from "../config"

export default function BcOptions({
  values,
  setValues,
  token,
  setChangedPriceOption,
}) {
  const [hasBarcods, setHasBarcods] = useState(false)
  const [crumbsArr, setCrumbsArr] = useState([])
  const [currentBarcods, setCurrentBarcods] = useState({ ...values.barcods })
  const [showInput, setShowInput] = useState(false)
  const [inputValues, setInputValues] = useState({
    barcode: "",
    price: "",
  })

  const [bcPrice, setBcPrice] = useState({})

  useEffect(() => {
    const barcods = optionsToBarcods(values.options)
    copyBarcods(values.barcods, barcods)
    setValues({ ...values, barcods })
    setCurrentBarcods({ ...barcods })
    setCrumbsArr([])
  }, [values.options])

  useEffect(() => {
    const barcode = crumbsArr.length
      ? crumbsArr.reduce((acc, item) => acc[item], values.barcods)
      : values.barcods
    if (typeof barcode === "string") {
      setInputValues({ ...inputValues, barcode })
      setShowInput(true)
    } else {
      setInputValues({ barcode: "", price: "" })
      setShowInput(false)
    }
    setCurrentBarcods(barcode)
  }, [crumbsArr])

  useEffect(() => {
    const getPriceByBarcode = async () => {
      const res = await fetch(`${API_URL}/api/barcode/${inputValues.barcode}`)
      if (!res.ok) {
        const { message } = await res.json()
        toast.error(`Ошибка при загрузке цены. ${message}`)
        return
      }
      const { price } = await res.json()
      setInputValues({ ...inputValues, price })
    }
    if (inputValues.barcode.length === 13) {
      getPriceByBarcode()
    }
  }, [inputValues.barcode])

  useEffect(() => {
    const fetchBarcods = async () => {
      const res = await fetch(`${API_URL}/api/barcode`)
      if (!res.ok) {
        const { message } = await res.json()
        toast.error(message)
        return
      }
      const { bcPrice } = await res.json()
      setBcPrice(bcPrice)
    }
    fetchBarcods()
  }, [values.barcods])

  const handleCheck = (e) => {
    const checked = e.target.checked
    setHasBarcods(checked)
  }

  const handleClick = (option) => {
    setCrumbsArr([...crumbsArr, option])
  }

  const handleBack = () => {
    setCrumbsArr(crumbsArr.slice(0, -1))
  }

  const handleSave = async () => {
    if (inputValues.barcode.length !== 13) {
      toast.error("Количество цифр должно быть равно 13")
      return
    }

    if (inputValues.price) {
      const res = await fetch(`${API_URL}/api/barcode/${inputValues.barcode}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify({
          price: inputValues.price,
          productId: values._id,
          crumbsArr,
        }),
      })
      if (!res.ok) {
        const { message } = await res.json()
        toast.error(message)
        return
      }
    }
    // если не выбивает ошибку с повторением штрихкода, только после этого меняем barcods
    const barcods = { ...values.barcods }
    let lastObj = crumbsArr
      .slice(0, -1)
      .reduce((acc, item) => acc[item], barcods)
    const lastKey = crumbsArr[crumbsArr.length - 1]
    lastObj[lastKey] = inputValues.barcode

    setValues({ ...values, barcods })
    setCrumbsArr(crumbsArr.slice(0, -1))
  }
  const handleChangeBc = (e) => {
    e.preventDefault()
    const value = e.target.value.replace(/[^0-9]/gi, "")

    setInputValues({ ...inputValues, barcode: value })
  }

  const handleChangePrice = (e) => {
    e.preventDefault()
    const value = e.target.value.replace(/[^\d.,]/gi, "").replace(",", ".")
    setInputValues({ ...inputValues, price: value })
  }

  const handleExportPrices = () => {
    const { newOptions, error, totalPrice, changedOption } = bcPricesToOptions({
      // передача КОПИИ barcods является ОБЯЗАТЕЛЬНОЙ
      barcods: JSON.parse(JSON.stringify(values.barcods)),
      options: values.options,
      bcPrice,
    })

    if (!error) {
      setValues({ ...values, options: newOptions, price: totalPrice })
      setChangedPriceOption(changedOption)
    } else {
      toast.error("Обнаружено более 1 меняющейся опции")
    }
  }

  return (
    <div className={styles.container}>
      <ToastContainer />
      <div className={styles.check_wrapper}>
        <input
          type="checkbox"
          id="check_button"
          onChange={(e) => handleCheck(e)}
          checked={hasBarcods}
        />
        <label htmlFor="check_button">Штрихкод</label>
        <GiCheckMark className={styles.icon} />

        <div className={styles.crumbs}>
          {crumbsArr.map((item, i) => (
            <div key={i}>
              <div>{item}</div>
              {i >= 0 && i < crumbsArr.length - 1 ? (
                <>
                  &nbsp; <FaLongArrowAltRight />
                  &nbsp;{" "}
                </>
              ) : null}
            </div>
          ))}
        </div>

        <FaChevronCircleUp
          className={styles.export_button}
          title="Экспорт прайсов в опции"
          onClick={handleExportPrices}
        />
      </div>

      {hasBarcods &&
      (Object.keys(currentBarcods).length ||
        typeof currentBarcods === "string") ? (
        <div className={styles.flex_list}>
          <FaArrowAltCircleLeft
            name="back"
            className={styles.icon}
            onClick={handleBack}
          />
          {showInput ? (
            <>
              <input
                type="text"
                onChange={handleChangeBc}
                value={inputValues.barcode}
                maxLength="13"
                placeholder="Штрихкод"
              />
              <input
                type="text"
                value={inputValues.price}
                placeholder="Цена"
                onChange={handleChangePrice}
                onBlur={(e) =>
                  setInputValues({
                    ...inputValues,
                    price: stringToPrice(e.target.value),
                  })
                }
              />
              <FaSave
                name="save"
                className={styles.icon}
                onClick={handleSave}
              />
            </>
          ) : (
            Object.keys(currentBarcods)
              .sort()
              .map((option, i) => (
                <div
                  key={i}
                  className={styles.flex_item}
                  onClick={() => handleClick(option)}
                >
                  {option}
                </div>
              ))
          )}
        </div>
      ) : null}
    </div>
  )
}
