import styles from "@/styles/ProductPage.module.scss"
import Layout from "@/components/Layout"
import { API_URL, NOIMAGE } from "@/config/index.js"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { getCurrencySymbol, getPriceForShow } from "utils"
import { useContext, useEffect, useMemo, useRef, useState } from "react"
import Slider from "@/components/Slider"
import Navbar from "@/components/Navbar"
import ProductsContext from "@/context/ProductsContext"
import Links from "@/components/Links"

import ProductTable from "@/components/ProductTable"

export default function productPage({ product }) {
  const { currencyShop } = useContext(ProductsContext)
  const { cart, setCart, currencyRate } = useContext(ProductsContext)
  const [qntAmount, setQntAmount] = useState({ qnt: "", amount: "" })
  

  // Здесь values то же самое что и product.optionValues но вместо barcode qnt
  const [values, setValues] = useState({})

  const [sliderValues, setSliderValues] = useState({
    isShow: false,
    idx: 0,
  })

  const [mainImageIdx, setMainImageIdx] = useState(0)

  const [cartBtnDisable, setCartBtnDisable] = useState(true)

 

  useEffect(() => {
    const table = JSON.parse(JSON.stringify(product.optionValues))
    const deep = (optionValues) => {
      if (optionValues.hasOwnProperty("price")) {
        optionValues.qnt = ""
        delete optionValues.barcode
        return
      } else {
        Object.keys(optionValues).forEach((item) => {
          deep(optionValues[item])
        })
      }
    }
    deep(table)
    setValues(table)
  }, [product])

  useEffect(() => {
    let totalQnt = 0
    let amount = 0
    const tableObj = values
    const deep = (optionValues) => {
      if ("price" in optionValues) {
        let qnt = parseInt(optionValues.qnt) || 0
        totalQnt += qnt
        amount += (parseFloat(optionValues.price) || 0) * qnt
        return
      } else {
        Object.keys(optionValues).forEach((item) => {
          deep(optionValues[item])
        })
      }
    }
    deep(tableObj)
    if (totalQnt > 0) {
      setCartBtnDisable(false)
    } else {
      setCartBtnDisable(true)
    }
    totalQnt = totalQnt.toString()
    amount = amount.toFixed(2) + " " + getCurrencySymbol(product.currencyValue)
    setQntAmount({ qnt: totalQnt, amount })
  }, [values])

  const handleCartClick = () => {
    if (cartBtnDisable) return
    // const options = Object.keys(product.options)
   const activeOptionsArray = Object.keys(product.ownOptions)
       .filter((item) => product.ownOptions[item].length)
       
   
    const addCart=[]
const crumbs=[]
    const deep = (optionValues) => {
      if ('price' in optionValues) {
        if (optionValues.qnt) {
          const options = Object.assign({}, ...activeOptionsArray.map((item, i) => ({ [item]: crumbs[i] }))) 
          addCart.push({
            name: product.name,
            options,
            qnt: optionValues.qnt,
            price: optionValues.price,
            currencyValue:product.currencyValue
          })
        }
      } else {
        Object.keys(optionValues).forEach(item => {
          crumbs.push(item)
          deep(optionValues[item])
          crumbs.pop()
        })
      }
    }
    deep(values)    
    setCart([...cart, ...addCart])  
    resetQnt()
    
  }

  const resetQnt = () => {
    const copyValues=JSON.parse(JSON.stringify(values))
    const deep = (optionValues) => {
      if ('price' in optionValues) {
        optionValues.qnt = ''
        return
      } else {
        Object.keys(optionValues).forEach(item => {
          deep(optionValues[item])
        })
     }
    }
    deep(copyValues)
    setValues(copyValues)
 }

  // ld+json for SEO
  const schemaData = {
    "@context": "http://www.schema.org",
    "@type": "product",
    brand: product.brandId.name,
    category: product.categoryId.name,
    name: product.name,
    article: product.model,
    image: product.images[0],
    description: product.description,
    price: product.price + " " + product.currencyValue,
  }

  return (
    <Layout
      title={Object.keys(product).length ? product.name : ""}
      description={Object.keys(product).length ? product.description : ""}
    >
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <div className={styles.header}>
        <Links home={true} back={true} />
      </div>
      <ToastContainer />
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.left}>
            <div className={styles.main_image}>
              <img
                src={
                  product.images.length
                    ? `${API_URL}${product.images[mainImageIdx]}`
                    : `${NOIMAGE}`
                }
                onClick={() =>
                  setSliderValues({ isShow: true, idx: mainImageIdx })
                }
              />
            </div>

            <div className={styles.added_images}>
              {product.imagesSm.length
                ? product.imagesSm.map((item, i) => (
                    <div
                      key={i}
                      className={
                        styles.added_image +
                        " " +
                        (i === mainImageIdx ? styles.image_active : "")
                      }
                    >
                      <img
                        src={`${API_URL}${item}`}
                        onClick={() => setMainImageIdx(i)}
                      />
                    </div>
                  ))
                : null}
            </div>
          </div>

          <div className={styles.center}>
            <div className={styles.center_header}>
              <div>
                <p>{product.name}</p>
              </div>
              <div>
                {Object.keys(currencyRate).length ? (
                  <div className={styles.price}>
                    {getPriceForShow({
                      currencyRate,
                      currencyShop,
                      product,
                    }) +
                      " " +
                      getCurrencySymbol(currencyShop)}
                  </div>
                ) : null}
              </div>
            </div>
            <div>
              <ProductTable
                product={product}
                setValues={setValues}
                values={values}
              />
            </div>
            <div className={styles.footer}>
              <p>Выбрано: {qntAmount.qnt}</p>
              <p>Сумма: {qntAmount.amount}</p>
            </div>
            <div className={styles.cart_wrapper}>
              <div
                onClick={handleCartClick}
                className={
                  styles.cart_button +
                  " " +
                  (cartBtnDisable ? styles.disable : "")
                }
              >
                <p>В корзину</p>
              </div>
            </div>
          </div>
        </div>
        {product.description ? (
          <div>
            <h4>Описание</h4>
            <p className={styles.description}>{product.description}</p>
          </div>
        ) : null}

        {sliderValues.isShow && (
          <Slider
            setSliderValues={setSliderValues}
            sliderValues={sliderValues}
            images={product.images}
            setMainImageIdx={setMainImageIdx}
          />
        )}
      </div>
    </Layout>
  )
}

export async function getServerSideProps({ params: { slug } }) {
  const res = await fetch(`${API_URL}/api/products/${slug}`)
  const { product } = await res.json()
  if (!res.ok) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      product,
    },
  }
}
