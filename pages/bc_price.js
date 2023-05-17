import AccessDenied from "@/components/AccessDenied"
import Layout from "@/components/Layout"
import Links from "@/components/Links"
import AuthContext from "@/context/AuthContext"
import styles from "@/styles/BcPrice.module.scss"
import React, { useContext, useEffect, useState } from "react"
import { FaSave, FaTimes, FaWindowClose } from "react-icons/fa"
import { stringToPrice } from "utils"
import { API_URL } from "../config"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function BcPrice() {
  const [values, setValues] = useState({
    barcode: "",
    price: "",
  })
  const [barcode, setBarcode] = useState("")
  const [product, setProduct] = useState(null)  
  const [bcCrumbs, setBcCrumbs] = useState([])  
  const {
    user: { isAdmin, token },
  } = useContext(AuthContext)

 

  useEffect(() => {
    const getProductByBc = async (bc) => {
      const res = await fetch(`${API_URL}/api/barcode/product/${bc}`)
      if (!res.ok) {
        const { message } = await res.json()
        toast.error(message)
        return
      }
      const { barcode,product } = await res.json()
      setBcCrumbs(barcode?barcode.crumbsArr:[])
      setProduct(product)
    }
    if (barcode) {
      getProductByBc(barcode)
    } else {
      // Если barcode изменился и стал пустым то обнуляем product и crumbs и values.price и выход
      setProduct(null)
      setBcCrumbs([])
      setValues({ ...values, price: "" })
      return
    }   
    
    getPriceByBarcode(barcode)
  }, [barcode])

  const getPriceByBarcode = async (value) => {
    const res = await fetch(`${API_URL}/api/barcode/${value}`)
    if (!res.ok) {
      const { message } = await res.json()
      toast.error(message)
      return
    }
    const { price } = await res.json()
    setValues({ ...values, price })
  }

  const savePrice = async () => {
    const res = await fetch(`${API_URL}/api/barcode/${values.barcode}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ price: values.price,productId:product._id,crumbsArr:bcCrumbs }),
    })
    if (!res.ok) {
      const { message } = await res.json()
      toast.error(message)
    }
    setValues({ barcode: "", price: "" })
    setProduct(null)
    setBcCrumbs([])
  }
  const deleteBc = async () => {
    if (barcode.length !== 13) {
      toast.error('Штрикод состоит из 13 цифр')
      return
    } else {
      const res = await fetch(`${API_URL}/api/barcode/${barcode}`, {
        method: 'DELETE',
        headers: {
          authorization: `Bearer ${token}`,
          'Content-Type':'application/json'
        }
      })
      if (!res.ok) {
        const { message } = await res.json()
        toast.error(message)
        return
      }
      toast.success('Штрихкод удален')
      setValues({ price: '', barcode: '' })
      setBarcode('')
  }
  }
  
  const handleBc = (e) => {
    e.preventDefault()
    let { value } = e.target
    value = value.replace(/\D/g, "")

    if (value.length === 13 && values.barcode !== value) {
      setBarcode(value)
      // getPriceByBarcode(value)
    } else {
      setBarcode("")
    }

    setValues({ ...values, barcode: value })
  }
  const handlePrice = (e) => {
    e.preventDefault()
    let { value } = e.target
    value = value.replace(/[^\d.,]+/g, "").replace(",", ".")
    setValues({ ...values, price: value })
  }

  return (
    <Layout title="Ввод цены по штрихкоду">
      <ToastContainer />
      {isAdmin ? (
        <>
          <div className={styles.header}>
            <Links home={true} back={true} />
            <div className={styles.header_right}>
              <FaWindowClose name='delete_icon' onClick={deleteBc } title='Удалить штрихкод'/>
            <FaSave name='save_icon' onClick={savePrice} title='Сохранить штрихкод'/>
            </div>
           
          </div>

          <div className={styles.container}>
            <div className={styles.left_side}>
              <label>
                Штрихкод
                <div className={styles.input_wrapper}>
                  <input
                    type="text"
                    maxLength="13"
                    value={values.barcode}
                    onChange={handleBc}
                  />
                  <FaTimes title='Очистить' onClick={() => {
                    setValues({ barcode: '', price: '' })
                    setBarcode('')
                  }} />
                </div>
              </label>
              <label>
                Прайс
                <input
                  type="text"
                  id="price"
                  value={values.price}
                  onChange={handlePrice}
                  onBlur={(e) =>
                    setValues({
                      ...values,
                      price: stringToPrice(e.target.value),
                    })
                  }
                />
              </label>
            </div>
            {product ? (
              <div className={styles.right_content}>
                <div className={styles.image}>
                  {product.imagesMd[0] ? (
                    <img src={`${API_URL}${product.imagesMd[0]}`} />
                  ) : (
                    <img src="/noimage.png" />
                  )}
                </div>
                <div>
                  <div>
                    <span>Бренд:</span>
                    <span>{product.brandId.name}</span>
                  </div>
                  <div>
                    <span>Категория:</span>
                    <span>{product.categoryId.name}</span>
                  </div>
                  <div>
                    <span>Модель:</span>
                    <span>{product.name}</span>
                  </div>
                  <div>
                    <span>Артикул:</span>
                    <span>{product.model}</span>
                  </div>
                  <div>
                    <span>Опции:</span>
                    <span>
                      {bcCrumbs.length ? bcCrumbs.join(" ") : "без опций"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.right_content}>Товар не найден</div>
            )}
          </div>
        </>
      ) : (
        <AccessDenied />
      )}
    </Layout>
  )
}


