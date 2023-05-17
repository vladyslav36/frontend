import React, { useEffect, useState } from 'react'
import styles from "@/styles/BcOptions.module.scss"
import "react-toastify/dist/ReactToastify.css"
import { toast, ToastContainer } from "react-toastify"
import { GiCheckMark } from 'react-icons/gi'
import { FaChevronCircleUp, FaSave } from 'react-icons/fa'
import { stringToPrice } from 'utils'
import { API_URL } from '../config'

export default function BcAlong({values,setValues,token}) {
  const [hasBarcods, setHasBarcods] = useState(false)  
  const [inputValues, setInputValues] = useState({
    barcode: values.barcode,
    price:''
  })

  // если values.barcods присутствует, то values.barcode очищается
  useEffect(() => {
    const rez = Object.keys(values.options).length
      ? Object.keys(values.options).some(
          (option) => Object.keys(values.options[option]).length
        )
      : false
    if (rez) setValues({ ...values, barcode: '' })
   
  },[values.options])
  // --------------------------------------------------------------

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

   const handleCheck = (e) => {
     const checked = e.target.checked
     setHasBarcods(checked)
  }
  
  const handleSave = async () => {
     if (inputValues.barcode.length !== 13) {
       toast.error("Количество цифр должно быть равно 13")
       return
    }

     if (inputValues.price) {
     const res= await fetch(`${API_URL}/api/barcode/${inputValues.barcode}`, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      method: "POST",
      body: JSON.stringify({ price: inputValues.price,crumbsArr:[],productId:values._id }),
      })
      if (!res.ok) {
       const { message } = await res.json()
       toast.error(message)
       return
      }
    }

    setValues({ ...values, barcode: inputValues.barcode })
    setInputValues({price:'',barcode:''})
  }
  const handleChangeBc = (e) => {
     e.preventDefault()
     const value = e.target.value.replace(/[^0-9]/gi, "")

     setInputValues({...inputValues,barcode:value})
  }

   const handleChangePrice = (e) => {
     e.preventDefault()
     const value = e.target.value.replace(/[^\d.,]/gi, "").replace(",", ".")
     setInputValues({ ...inputValues, price: value })
  }
  
  const handleExportPrices =async () => { 
    if (values.barcode) {
      const res = await fetch(`${API_URL}/api/barcode/${values.barcode}`)
      if (!res.ok) {
        const { message } = await res.json()
        toast.error(message)
        return
      }
      const { price } = await res.json()
      setValues({...values,price})
    }
  }
 
  return (
    <div className={styles.container}>
      <ToastContainer />
      <div className={styles.check_wrapper}>
        <input
          type="checkbox"
          id="check_btn"
          onChange={(e) => handleCheck(e)}
          checked={hasBarcods}
        />
        <label htmlFor="check_btn">Штрихкод</label>
        <GiCheckMark className={styles.icon} />
         <FaChevronCircleUp
        className={styles.export_button}
        title="Экспорт прайсов в опции"
        onClick={handleExportPrices}
      />
      </div>
     

      <div className={styles.flex_list}>
        {hasBarcods ? (
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

            <FaSave name="save" className={styles.icon} onClick={handleSave} />
          </>
        ) : null}
      </div>
    </div>
  )
}
