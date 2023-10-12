import styles from "@/styles/ProductPage.module.scss"
import Layout from "@/components/Layout"
import { API_URL, NOIMAGE } from "@/config/index.js"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { getCurrencySymbol, getPriceForShow } from "utils"
import { useContext, useEffect, useRef, useState } from "react"
import Slider from "@/components/Slider"
import Navbar from "@/components/Navbar"
import ProductsContext from "@/context/ProductsContext"
import Links from "@/components/Links"

import ProductTable from "@/components/ProductTable"

export default function productPage({ product: productDb }) {
  const { currencyShop } = useContext(ProductsContext)
  const { cart, setCart, currencyRate } = useContext(ProductsContext)

  const product = { ...productDb }



  const initialState = () => {
    const table = JSON.parse(JSON.stringify(product.optionValues))
    const deep = (optionValues) => {
      if (optionValues.hasOwnProperty('price')) {
        optionValues.qnt = ''
        delete optionValues.barcode
        return
      } else {
        Object.keys(optionValues).forEach(item => {
          deep(optionValues[item])
        })
      }
    }
    deep(table)
    return table
  }

  // Здесь values то же самое что и product.optionValues но вместо barcode qnt
const [values,setValues]=useState(initialState())
  

  const [sliderValues, setSliderValues] = useState({
    isShow: false,
    idx: 0,
  })
  // Прайс на единицу товара с учетом опции
 

  const [mainImageIdx, setMainImageIdx] = useState(0)

  const [cartBtnDisable, setCartBtnDisable] = useState(true)

 

  const handleCartClick = () => {
    if (cartBtnDisable) return
    const options = Object.keys(product.options)

    setCart([
      ...cart,
      {
        name: product.name,
        options: options.length
          ? Object.assign(
              {},
              ...options.map((item) => ({ [item]: values[item] }))
            )
          : {},
        qnt: values.qnt,
        price: '',
        currencyValue: product.currencyValue,
      },
    ])
    clearValues()
  }

 

  const clearValues = () => {
    setValues(
      Object.assign(
        {},
        ...Object.keys(product.options).map((item) => ({ [item]: "" })),
        {
          qnt: "",
        }
      )
    )
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
  console.log(values)
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
                    <div>
                      {getPriceForShow({
                        currencyRate,
                        currencyShop,
                        product,
                      })}
                    </div>
                    <div>{getCurrencySymbol(currencyShop)}</div>
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
           
            <div className={styles.counter_cart_wrapper}>
            

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
