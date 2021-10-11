import styles from "@/styles/ProductPage.module.css"
import Layout from "@/components/Layout"
import { API_URL, NOIMAGE } from "@/config/index.js"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Link from "next/link"
import { FaShoppingCart, FaTimes } from "react-icons/fa"
import { getCurrencySymbol, getPriceForShow } from "utils"
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
  const [values, setValues] = useState({
    color: "",
    size: "",
    height: "",
    qnt: "",
  })

  const [isShowList, setIsShowList] = useState({
    color: false,
    size: false,
    height: false,
  })
  const inputQnt = useRef()
  const [chosen, setChosen] = useState([])
  const [sliderValues, setSliderValues] = useState({
    isShow: false,
    idx: 0,
  })
  const [mainImageIdx, setMainImageIdx] = useState(0)
  const fakeArray = ["", "", "", "", "", "", ""]

  // Функция добавляет опционную цену к строке опции
  const getList = (name) => {
    return product[name].map((item) =>
      item.price
        ? `${item.name} : ${item.price} ${getCurrencySymbol(
            product.currencyValue
          )}`
        : item.name
    )
  }
  //
  // Функция возвращает опционный прайс при выбранных color size height(если таковой есть) или пустую строку
  const getOptionPrice = () => {
    const colorItem = product.colors.find((item) => item.name === values.color)
    const sizeItem = product.sizes.find((item) => item.name === values.size)
    const heightItem = product.heights.find(
      (item) => item.name === values.height
    )
    const optionPrice =
      (values.color && colorItem ? colorItem.price : "") ||
      (values.size && sizeItem ? sizeItem.price : "") ||
      (values.height && heightItem ? heightItem.price : "")
    return optionPrice
  }
  //
  const listItemClick = ({ item, option }) => {
    setIsShowList({ ...isShowList, [option]: false })
    setValues({ ...values, [option]: item.split(":")[0].trim() })
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
    console.log("cart click")
    setCart([...cart, ...chosen])
    setChosen([])
  }
  console.log(cart)
  const changeHandler = (e) => {
    e.preventDefault()
    const { name, value } = e.target

    setValues({ ...values, [name]: value })
  }

  const addedValues = (e) => {
    e.preventDefault()

    if (product.sizes.length && !values.size) {
      toast.error("Поле Размер должно быть заполнено")
      return
    }
    if (product.colors.length && !values.color) {
      toast.error("Поле Цвет должно быть заполнено")
      return
    }
    if (product.heights.length && !values.height) {
      toast.error("Поле Рост должно быть заполнено")
      return
    }
    if (!values.qnt) {
      toast.error("Поле Количество должно быть заполнено")
      return
    }
    if (+values.qnt <= 0) {
      toast.error("Количество должно быть больше нуля")
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
        color: values.color,
        size: values.size,
        height: values.height,
        qnt: values.qnt,
        price: getOptionPrice() || product.price,
        currencyValue: product.currencyValue,
      },
    ])
    clearValues()
  }
  const clearValues = () => {
    setValues({
      color: "",
      size: "",
      height: "",
      qnt: "",
    })
  }

  const handleDelete = (num) => {
    setChosen(chosen.filter((item, i) => i !== num))
  }

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
                  <p>{product.brand}</p>
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
                      price: product.price,
                    })}{" "}
                    {getCurrencySymbol(currencyShop)}
                  </p>
                ) : null}
              </div>
            </div>

            <div className={styles.inputs}>
              {/* <div> */}
              {product.sizes.length ? (
                <div
                  tabIndex={0}
                  onFocus={() => setIsShowList({ ...isShowList, size: true })}
                  onBlur={() => setIsShowList({ ...isShowList, size: false })}
                >
                  <label htmlFor="size">Размер</label>
                  <input
                    type="text"
                    id="size"
                    name="size"
                    value={values.size}
                    onChange={changeHandler}
                    autoComplete="off"
                    readOnly
                  />
                  <DropDownList
                    isShow={isShowList.size}
                    itemsList={getList("sizes")}
                    handleClick={(item) =>
                      listItemClick({ item, option: "size" })
                    }
                  />
                </div>
              ) : null}
              {product.colors.length ? (
                <div
                  tabIndex={0}
                  onFocus={() => setIsShowList({ ...isShowList, color: true })}
                  onBlur={() => setIsShowList({ ...isShowList, color: false })}
                >
                  <label htmlFor="color">Цвет</label>
                  <input
                    type="text"
                    id="color"
                    name="color"
                    value={values.color}
                    onChange={changeHandler}
                    autoComplete="off"
                    readOnly
                  />
                  <DropDownList
                    isShow={isShowList.color}
                    itemsList={getList("colors")}
                    handleClick={(item) =>
                      listItemClick({ item, option: "color" })
                    }
                  />
                </div>
              ) : null}
              {product.heights.length ? (
                <div
                  tabIndex={0}
                  onFocus={() => setIsShowList({ ...isShowList, height: true })}
                  onBlur={() => setIsShowList({ ...isShowList, height: false })}
                >
                  <label htmlFor="height">Рост</label>
                  <input
                    type="text"
                    id="height"
                    name="height"
                    value={values.height}
                    onChange={changeHandler}
                    autoComplete="off"
                    readOnly
                  />
                  <DropDownList
                    isShow={isShowList.height}
                    itemsList={getList("heights")}
                    handleClick={(item) =>
                      listItemClick({ item, option: "height" })
                    }
                  />
                </div>
              ) : null}
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
              {/* </div> */}
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
                    <th
                      style={
                        product.heights.length
                          ? {}
                          : { visibility: "hidden", width: 0 }
                      }
                    >
                      Рост
                    </th>
                    <th
                      style={
                        product.sizes.length
                          ? {}
                          : { visibility: "hidden", width: 0 }
                      }
                    >
                      Размер
                    </th>
                    <th
                      style={
                        product.colors.length
                          ? {}
                          : { visibility: "hidden", width: 0 }
                      }
                    >
                      Цвет
                    </th>
                    <th>Кол-во</th>
                    <th>
                      Цена&nbsp;{getCurrencySymbol(product.currencyValue)}
                    </th>
                    <th>&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  {chosen.length ? (
                    chosen.map((item, i) => (
                      <tr key={i}>
                        <td>{item.height}</td>
                        <td>{item.size}</td>
                        <td>{item.color}</td>
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

        <h4>Описание</h4>
        <p>{product.description}</p>
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
