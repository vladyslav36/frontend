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
import ProductOptions from "@/components/ProductOptions"

export default function productPage({ slug, product: productDb }) {
  const { currencyShop } = useContext(ProductsContext)
  const { cart, setCart, currencyRate } = useContext(ProductsContext)

  const product = { ...productDb }

  // Удаляем опции в товаре которые в нем не используются
  Object.keys(product.options).forEach((option) => {
    const isCheck = Object.keys(product.options[option].values).some(
      (item) => product.options[option].values[item].checked
    )
    if (!isCheck) delete product.options[option]
  })

  const [values, setValues] = useState(
    Object.assign(
      {},
      ...Object.keys(product.options).map((item) => ({ [item]: "" })),
      { qnt: "" }
    )
  )

  
  
  const [sliderValues, setSliderValues] = useState({
    isShow: false,
    idx: 0,
  })
  // Прайс на единицу товара с учетом опции
  const [currentPrice, setCurrentPrice] = useState(product.price)

  const [mainImageIdx, setMainImageIdx] = useState(0)

  const [cartBtnDisable, setCartBtnDisable] = useState(true)

  // Устанавливаем currentPrice. Если опционного нет, тогда без изменений, если есть-меняем на опционный
  // находим меняющуюся опцию, берем value из values и если оно есть берем price
  useEffect(() => {
    const option = Object.keys(product.options).find(
      (item) => product.options[item].isChangePrice
    )
    if (option) {
      const value = values[option]
      const price = value ? product.options[option].values[value].price : ""
      setCurrentPrice(price || product.price)
    }
  }, [values])

  useEffect(() => {
    const options = Object.keys(values)
    const isActive = options.every((item) => values[item])
    if (isActive) {
      setCartBtnDisable(false)
    } else {
      setCartBtnDisable(true)
    }
  }, [values])
 
  const handleQnt = (e) => {
    const number = +e.target.value
    if (number === 0) {
      setValues({ ...values, qnt: "" })
      return
    }
    if (
      !isNaN(number) &&
      number > 0 &&
      number < 999 &&
      Number.isInteger(number)
    ) {
      setValues({ ...values, qnt: "" + number })
    } else {
      return
    }
  }

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
        price: currentPrice,
        currencyValue: product.currencyValue,
      },
    ])
    clearValues()
    
  }

    const decQnt = () => {
    const number = +values.qnt - 1
    if (number > 0) {
      setValues({ ...values, qnt: "" + number })
    } else {
      if (number === 0) {
        setValues({ ...values, qnt: "" })
      } else {
        return
      }
    }
  }
  const incQnt = () => {
    const number = +values.qnt + 1
    if (number <1000) {
      setValues({ ...values, qnt: "" + number })
    } else {
      return
    }
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
                <div>
                  <h5>Бренд:</h5>
                  <p>{product.brandId ? product.brandId.name : ""}</p>
                </div>
                <div>
                  <h5>Категория:</h5>
                  <p>{product.categoryId ? product.categoryId.name : ""}</p>
                </div>
                <div>
                  <h5>Каталог:</h5>
                  <p>{product.catalogId ? product.catalogId.name : ""}</p>
                </div>
                <div>
                  <h5>Модель:</h5>
                  <p>{product.name}</p>
                </div>
                <div>
                  <h5>Артикул:</h5>
                  <p>{product.model}</p>
                </div>
              </div>
              <div>
                {Object.keys(currencyRate).length ? (
                  <div className={styles.price}>
                    <div>
                      {getPriceForShow({
                        currencyRate,
                        currencyValue: product.currencyValue,
                        currencyShop,
                        price: currentPrice,
                      })}
                    </div>
                    <div>{getCurrencySymbol(currencyShop)}</div>
                  </div>
                ) : null}
              </div>
            </div>

            {Object.keys(product.options).length ? (
              <ProductOptions
                options={product.options}
                currencyValue={product.currencyValue}
                values={values}
                setValues={setValues}
              />
            ) : null}
            <div className={styles.counter_cart_wrapper}>
              <div className={styles.counter_wrapper}>
                <i
                  style={{ lineHeight: "0" }}
                  className="fa-solid fa-square-minus fa-2xl"
                  onClick={decQnt}
                ></i>
                <input
                  type="text"
                  className={styles.counter}
                  value={values.qnt}
                  onChange={handleQnt}
                />{" "}
                <i
                  style={{ lineHeight: "0" }}
                  className="fa-solid fa-square-plus fa-2xl"
                  onClick={incQnt}
                ></i>
              </div>

             
              <div onClick={handleCartClick}
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
            <p>{product.description}</p>
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
      slug,
    },
  }
}
