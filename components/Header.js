import styles from "@/styles/Header.module.css"
import Link from "next/link"
import { useContext, useState } from "react"
import AuthContext from "@/context/AuthContext"
import ProductsContext from "@/context/ProductsContext"

import {
  FaHome,
  FaPhone,
  FaSearch,
  FaShoppingCart,
  FaSignInAlt,
} from "react-icons/fa"
import {
  getCurrencySymbol,
  getPriceForShow,
  getQntInCart,
  getTotalInCart,
} from "utils"
import { API_URL, NOIMAGE, PHONE1, PHONE2 } from "../config"
import { useRouter } from "next/router"
import useSWR from "swr"
import Loupe from "./Loupe"

export default function Header() {
  const router = useRouter()
  const { login, logout } = useContext(AuthContext)
  const { currencyShop, setCurrencyShop, cart } = useContext(ProductsContext)

  const [isShowList, setIsShowList] = useState(false)
  const [isShowLoupe, setIsShowLoupe] = useState(false)
  const [image, setImage] = useState("")
  const [searchString, setSearchString] = useState("")
  

  const getSearchItemsList = (items, searchString) => {
    const limit = 10
    const list = items
      .filter(
        ({ name, model }) =>
          name.toLowerCase().indexOf(searchString.toLowerCase()) >= 0 ||
          model.toLowerCase().indexOf(searchString.toLowerCase()) >= 0
      )
      .slice(0, limit)

    return list
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("item")    
  }
  const handleChange = (e) => {
    e.preventDefault()
    setSearchString(e.target.value)
  }
  
  const handleClick = (name) => {
    setIsShowList(false)
    setSearchString(name)
  }
  
  const { data } = useSWR(`${API_URL}/api/products`)
  
  const { data: dataRate } = useSWR(`${API_URL}/api/currencyrate`)
 

  return (
    <header className={styles.header}>
      <div className={styles.header_top}>
        <div className={styles.header_top_left}>
          <div className={styles.currency_wrapper}>
            <div className={styles.currencies}>
              <p>USD: {dataRate ? dataRate.currencyRate.USD.toFixed(2) : ""}</p>
              <p>EUR: {dataRate ? dataRate.currencyRate.EUR.toFixed(2) : ""}</p>
            </div>
            <div className={styles.select}>
              <p>{getCurrencySymbol(currencyShop)} Валюта магазина</p>
              <select
                value={currencyShop}
                onChange={(e) => setCurrencyShop(e.target.value)}
              >
                <option value="UAH">UAH</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>
          <div className={styles.phones}>
            <div className={styles.phone_1}>
              <FaPhone />
              &nbsp;<p>{PHONE1}</p>
            </div>
            <div className={styles.phone_2}>
              <FaPhone />
              &nbsp;<p>{PHONE2}</p>
            </div>
          </div>
        </div>
        <nav>
          <Link href="/account/login">
            <a className={styles.login}>
              <FaSignInAlt className={styles.icon} />
              <p>Войти</p>
            </a>
          </Link>
        </nav>
      </div>
      <div className={styles.header_bottom}>
        <Link href="/">
          <div className={styles.logos}>
            <div className={styles.logo_home}>
              <a>
                <FaHome />
              </a>
            </div>
            <div className={styles.logo}>
              <a>Кармен</a>
            </div>
          </div>
        </Link>
        <div className={styles.search_check_wrapper}>
          <form onSubmit={handleSubmit} className={styles.search}>
            <div
              className={styles.input_group}
              tabIndex={0}
              onFocus={() => setIsShowList(true)}
              onBlur={() => setIsShowList(false)}
            >
              <input type="text" value={searchString} onChange={handleChange} />
              {data && data.products.length ? (
                <ul
                  className={
                    styles.drop_down_list + " " + (isShowList && styles.active)
                  }
                >
                  {getSearchItemsList(data.products, searchString).map(
                    (item, i) => (
                      <Link href={`/product/${item.slug}`} key={i}>
                        <li onClick={() => handleClick(item.name)}>
                          <div className={styles.left_wrapper}>
                            <img
                              src={
                                item.imagesSm[0]
                                  ? `${API_URL}${item.imagesSm[0]}`
                                  : `${NOIMAGE}`
                              }
                              alt="No image"
                              onClick={(e) => {
                                e.stopPropagation()
                                setIsShowLoupe(true)
                                setImage(item.images[0])
                              }}
                            />
                            <div>
                              {item.model ? <p>Артикул:{item.model}</p> : null}
                              <p>Модель:{item.name}</p>
                            </div>
                          </div>
                          <div className={styles.right_wrapper}>
                            {dataRate ? (
                              <p>
                                {getPriceForShow({
                                  currencyShop,
                                  currencyRate: dataRate.currencyRate,
                                  currencyValue: item.currencyValue,
                                  price: item.price,
                                })}
                                &nbsp;{getCurrencySymbol(currencyShop)}
                              </p>
                            ) : null}
                          </div>
                        </li>
                      </Link>
                    )
                  )}
                </ul>
              ) : null}
              {isShowLoupe ? (
                <Loupe setIsShow={setIsShowLoupe} image={image} />
              ) : null}
              <button>
                <FaSearch />
              </button>
            </div>
          </form>
         
        </div>

        <div className={styles.cart}>
          <Link href="/cart">
            <a>
              <FaShoppingCart className={styles.icon} />
              <p>Товаров {cart ? getQntInCart(cart) : "0"}</p>
            </a>
          </Link>
        </div>
      </div>
    </header>
  )
}
