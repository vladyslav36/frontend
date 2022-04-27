import styles from "@/styles/ProductPage.module.css"
import Layout from "@/components/Layout"
import { API_URL, NOIMAGE } from "@/config/index.js"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FaShoppingCart, FaTimes, FaMinus, FaPlus } from "react-icons/fa"
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

  const inputQnt = useRef()
  const [chosen, setChosen] = useState([])
  const [sliderValues, setSliderValues] = useState({
    isShow: false,
    idx: 0,
  })
  // Прайс на единицу товара с учетом опции
  const [currentPrice, setCurrentPrice] = useState(product.price)

  const [mainImageIdx, setMainImageIdx] = useState(0)
  const fakeArray = ["", "", "", "", "", "", ""]
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

  const getTotalQnt = () => {
    return chosen.reduce((acc, item) => acc + +item.qnt, 0)
  }

  const getTotalAmount = () => {
    const result = chosen.reduce(
      (acc, item) => Math.round((acc + item.price * item.qnt) * 100) / 100,
      0
    )
    return result.toFixed(2)
  }

  const handleCartClick = () => {
    setCart([...cart, ...chosen])
    setChosen([])
  }

  const addedValues = (e) => {
    e.preventDefault()
    const options = Object.keys(product.options)
    let error = false
    if (options.length) {
      options.forEach((name) => {
        if (!values[name]) {
          toast.error(`Поле ${name} должно быть заполнено`)
          error = true
          return
        }
      })
    }
    if (error) return
    if (!values.qnt) {
      toast.error("Поле Количество должно быть заполнено")
      return
    }
    if (+values.qnt <= 0 || +values.qnt > 999) {
      toast.error("Количество должно быть больше нуля и меньше 1000")
      setValues({ ...values, qnt: "" })
      inputQnt.current.focus()
      return
    }
    if (!Number.isInteger(+values.qnt)) {
      toast.error("Количество должно быть целым числом")
      setValues({ ...values, qnt: "" })
      inputQnt.current.focus()
      return
    }

    setChosen([
      ...chosen,
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
    if (Number.isInteger(+values.qnt) && +values.qnt > 0) {
      setValues({ ...values, qnt: "" + (+values.qnt - 1) })
    } else {
      toast.warning("Количество должно быть целым числом больше нуля")
    }
  }
  const incQnt = () => {
    if (Number.isInteger(+values.qnt) && +values.qnt >= 0) {
      setValues({ ...values, qnt: "" + (+values.qnt + 1) })
    } else {
      toast.warning("Количество должно быть целым числом больше нуля")
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

  const handleDelete = (num) => {
    setChosen(chosen.filter((item, i) => i !== num))
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
    <Layout title={Object.keys(product).length ? product.name : ""}>
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <div className={styles.header}>
        <Links home={true} back={true} />
        <button
          className={styles.cart_button}
          onClick={handleCartClick}
          title="Добавить в корзину"
        >
          <FaShoppingCart className={styles.icon} />
          <span>В корзину</span>
        </button>
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
              {fakeArray.map((item, i) => (
                <div className={styles.fake_image} key={i}></div>
              ))}
            </div>
          </div>

          <div className={styles.center}>
            <div className={styles.center_header}>
              <div>
                <div>
                  <h5>Бренд:</h5>
                  <p>{product.brandId.name}</p>
                </div>
                <div>
                  <h5>Категория:</h5>
                  <p>{product.categoryId.name}</p>
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
                  <p className={styles.price}>
                    {getPriceForShow({
                      currencyRate,
                      currencyValue: product.currencyValue,
                      currencyShop,
                      price: currentPrice,
                    })}{" "}
                    {getCurrencySymbol(currencyShop)}
                  </p>
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
            <div className={styles.counter_wrapper}>
              <FaMinus className={styles.icons} onClick={decQnt} />
              <input
                type="text"
                className={styles.counter}
                value={values.qnt}
                onChange={(e) => setValues({ ...values, qnt: e.target.value })}
              />{" "}
              <FaPlus className={styles.icons} onClick={incQnt} />
            </div>
            <div className={styles.button}>
              <button type="button" onClick={addedValues}>
                Выбрать
              </button>
            </div>

            <div className={styles.table}>
              <table>
                <caption>Выбрано товаров</caption>
                <thead>
                  <tr>
                    {Object.keys(product.options).length
                      ? Object.keys(product.options).map((item, i) => (
                          <th key={i}>{item}</th>
                        ))
                      : null}

                    <th>Кол-во</th>
                    <th>
                      Цена&nbsp;{getCurrencySymbol(product.currencyValue)}
                    </th>
                    <th className={styles.flex}>
                      <div className={styles.icon_wrapper}>
                        <FaTimes
                          className={styles.icon}
                          onClick={() => setChosen([])}
                        />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {chosen.length ? (
                    chosen.map((item, i) => (
                      <tr key={i}>
                        {Object.keys(product.options).length
                          ? Object.keys(product.options).map((opt, i) => (
                              <td key={i}>{item.options[opt]}</td>
                            ))
                          : null}
                        <td>{item.qnt}</td>
                        <td>{item.price}</td>
                        <td className={styles.flex}>
                          <div className={styles.icon_wrapper}>
                            <FaTimes
                              className={styles.icon}
                              onClick={() => handleDelete(i)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td>&nbsp;</td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="6">
                      <div className={styles.footer_wrapper}>
                        <p>Всего товаров {getTotalQnt()}</p>
                        <p>
                          На сумму {getTotalAmount()}&nbsp;
                          {getCurrencySymbol(product.currencyValue)}
                        </p>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
        {product.description ? (
          <>
            <h4>Описание</h4>
            <p>{product.description}</p>
          </>
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
