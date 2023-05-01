import AccessDenied from "@/components/AccessDenied"
import Layout from "@/components/Layout"
import Links from "@/components/Links"
import AuthContext from "@/context/AuthContext"
import styles from "@/styles/BcPrice.module.scss"
import React, { useContext, useEffect, useState } from "react"
import { FaSave } from "react-icons/fa"
import { stringToPrice } from "utils"
import { API_URL } from "../config"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function BcPrice({ products }) {
  const [values, setValues] = useState({
    barcode: '',
    price:''
  })
  const [barcode,setBarcode]=useState('')
  const [bcInput, setBcInput] = useState("")
  const [priceInput, setPriceInput] = useState("")
  const [product, setProduct] = useState(null)
  const [bcCrumbs, setBcCrumbs] = useState([])
  const [brand, setBrand] = useState(null)
  const [category,setCategory]=useState(null)
  const {
    user: { isAdmin,token },
  } = useContext(AuthContext)

  useEffect(() => { 
    const getBrand = async () => {
      const res = await fetch(`${API_URL}/api/products/${product.slug}`)
      const { product:productDb } = await res.json()
      setBrand(productDb.brandId.name)
      setCategory(productDb.categoryId.name)
    }
    if (product) {
      getBrand()
    }
  }, [product])

  const getPriceByBarcode = async (value) => {
    const res = await fetch(`${API_URL}/api/barcode/${value}`)
    if (!res.ok) {
      const { message }=await res.json()
      toast.error(message)
      return
    }
    const { price } = await res.json()
    setPriceInput(price)
  }
  
  const savePrice =async () => {
    const res = await fetch(`${API_URL}/api/barcode/${bcInput}`, {
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization:`Bearer ${token}`
      },
      body:JSON.stringify({price:priceInput})
    })
    if (!res.ok) {
      const { message } = await res.json()
      toast.error(message)
    }
    setBcInput('')
    setPriceInput('')
    setProduct(null)
    setBcCrumbs([])
  }

  const handleBc = (e) => {
    e.preventDefault()
    let { value } = e.target
    value = value.replace(/\D/g, "")

    if (value.length === 13 && bcInput !== value) {
getPriceByBarcode(value)
      products.forEach((item) => {
        if (item.barcode === value) {
          setProduct(item)
          return
        } else {
          if (Object.keys(item.barcods).length) {
            let crumbs = []
            // Ф-я searchBc ищет методом рекурсии совпадение штрихкода. При совпадении сохраняется продукт и путь-крошки
            // в объекте barcods к этому штрихкоду.Для сохранения крошек используется текущий уровень погружения в рекурсию level
            // и временный массив crumbs. При совпадении массив crumbs копируется в bcCrumbs
            const searchBc = (bcObj) => {
              Object.keys(bcObj).forEach((key) => {
                crumbs[level] = key
                if (typeof bcObj[key] == "string") {
                  if (bcObj[key] === value) {
                    // rezCrumbs=[...crumbs]
                    // rez = item
                    setProduct(item)
                    setBcCrumbs([...crumbs])
                    return
                  }
                } else {
                  level++
                  searchBc(bcObj[key])
                }
              })
              level--
            }
            let level = 0
            searchBc(item.barcods)
          }
        }
      })
    } else {
      setProduct(null)
      setBcCrumbs([])
      
    }
    setBcInput(value)
  }
  const handlePrice = (e) => {
    e.preventDefault()
    let { value } = e.target
    value = value.replace(/[^\d.,]+/g, "").replace(",", ".")
    setPriceInput(value)
  }
  console.log(product)
  return (
    <Layout title="Ввод цены по штрихкоду">
      <ToastContainer/>
      {isAdmin ? (
        <>
          <div className={styles.header}>
            <Links home={true} back={true} />
            <FaSave className={styles.save_icon} onClick={savePrice} />
          </div>

          <div className={styles.container}>
            <div className={styles.left_side}>
              <label>
                Штрихкод
                <input
                  type="text"
                  maxLength="13"
                  value={bcInput}
                  onChange={handleBc}
                />
              </label>
              <label>
                Прайс
                <input
                  type="text"
                  id="price"
                  value={priceInput}
                  onChange={handlePrice}
                  onBlur={(e) => setPriceInput(stringToPrice(e.target.value))}
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
                      <span>{brand }</span>
                    </div>
                    <div>
                      <span>Категория:</span>
                      <span>{category }</span>
                    </div>
                    <div>
                      <span>Модель:</span>
                      <span>{product.name }</span>
                    </div>
                    <div>
                      <span>Артикул:</span>
                      <span>{product.model }</span>
                    </div>
                    <div>
                      <span>Опции:</span>
                      <span>{bcCrumbs.length?bcCrumbs.join(' '):'без опций'}</span>
                    </div>
                   
                  </div>
                </div>
              ) : (<div className={styles.right_content}>Товар не найден</div>)}           
          </div>
        </>
      ) : (
        <AccessDenied />
      )}
    </Layout>
  )
}

export async function getServerSideProps() {
  const res = await fetch(`${API_URL}/api/products`)
  const { products } = await res.json()
  return {
    props: {
      products,
    },
  }
}
