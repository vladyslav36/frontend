import styles from "@/styles/ProductPage.module.css"
import Layout from "@/components/Layout"
import { API_URL, NOIMAGE } from "@/config/index.js"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Link from "next/link"
import { FaShoppingCart, FaTimes } from "react-icons/fa"
import { getBrand, getCurrencySymbol, getPriceForShow } from "utils"
import { useContext, useEffect, useRef, useState } from "react"
import DropDownList from "@/components/DropDownList"
import Slider from "@/components/Slider"
import { useRouter } from "next/router"
import Navbar from "@/components/Navbar"
import ProductsContext from "@/context/ProductsContext"
import useSWR from "swr"
import Links from "@/components/Links"

export default function productPage({ slug, product }) {
  const router = useRouter()
  const { currencyShop } = useContext(ProductsContext)
  const { cart, setCart } = useContext(ProductsContext)
  const { data: dataRate } = useSWR(`${API_URL}/api/currencyrate`)
  const [values, setValues] = useState(
    Object.assign(
      {},
      ...Object.keys(product.options).map((item) => ({ [item]: "" })),
      { qnt: "" }
    )
  )

  const [isShowList, setIsShowList] = useState(
    Object.assign(
      {},
      ...Object.keys(product.options).map((item) => ({ [item]: false }))
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
    const option =Object.keys(product.options).find((item) => product.options[item].isChangePrice)
    if (option) {
      const value = values[option]
      const price = value
        ? product.options[option].values[value].price
        : ""
      setCurrentPrice(price || product.price)
    }
  }, [values])

  // Функция добавляет опционную цену к строке опции
  const getList = (name) => {
    
    const option = product.options[name]
    if (option.isChangePrice) {
      const symbol = getCurrencySymbol(product.currencyValue)
      const checkedValues = Object.keys(option.values).filter(item => option.values[item].checked)
      
      return checkedValues.map(item=>option.values[item].price?`${item} : ${option.values[item].price}${symbol}`:`${item}`)
      
    } else {
      
      return Object.keys(option.values).filter((item) =>
        option.values[item].checked)
      
    }
  }

  //

  //
  const listItemClick = ({ item, option }) => {
    setIsShowList({ ...isShowList, [option]: false })
    const optionValue = item.split(":")[0].trim()
    setValues({ ...values, [option]: optionValue })
  }

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

  const changeHandler = (e) => {
    e.preventDefault()
    const { name, value } = e.target

    setValues({ ...values, [name]: value })
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
  console.log(chosen)
  return (
    <Layout title={`Страница товара ${slug}`}>
      <Navbar />
      <div className={styles.header}>
        <Links home={true} back={true} />
        <button className={styles.cart_button} onClick={handleCartClick}>
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
                      // className={i === mainImageIdx ? styles.image_active : ""}
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
                {dataRate ? (
                  <p className={styles.price}>
                    {getPriceForShow({
                      currencyRate: dataRate.currencyRate,
                      currencyValue: product.currencyValue,
                      currencyShop,
                      price: currentPrice,
                    })}{" "}
                    {getCurrencySymbol(currencyShop)}
                  </p>
                ) : null}
              </div>
            </div>

            <div className={styles.inputs}>
              {Object.keys(product.options).length
                ? Object.keys(product.options).map((option, i) => (
                    <div
                      key={i}
                      tabIndex={0}
                      onFocus={() =>
                        setIsShowList({ ...isShowList, [option]: true })
                      }
                      onBlur={() =>
                        setIsShowList({ ...isShowList, [option]: false })
                      }
                    >
                      <label htmlFor={option}>{option}</label>
                      <input
                        type="text"
                        id={option}
                        value={values[option]}
                        autoComplete="off"
                        readOnly
                      />
                      <DropDownList
                        isShow={isShowList[option]}
                        itemsList={getList(option)}
                        handleClick={(item) =>
                          listItemClick({ item, option: option })
                        }
                      />
                    </div>
                  ))
                : null}

              <div>
                <label htmlFor="qnt">Количество</label>
                <input
                  ref={inputQnt}
                  type="text"
                  id="qnt"
                  name="qnt"
                  onChange={changeHandler}
                  value={values.qnt}
                />
              </div>
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
  const data = await fetch(`${API_URL}/api/products/${slug}`)
  const { product } = await data.json()
  return {
    props: {
      product,
      slug,
    },
  }
}
