import styles from "@/styles/Header.module.css"
import Link from "next/link"
import { useContext, useEffect, useState } from "react"
import AuthContext from "@/context/AuthContext"
import ProductsContext from "@/context/ProductsContext"
import {
  FaHome,
  FaPhone,
  FaSearch,
  FaShoppingCart,
  FaSignInAlt  
} from "react-icons/fa"
import {
  getCurrencySymbol,
  getPriceForShow,
  getQntInCart  
} from "utils"
import { API_URL, NOIMAGE, PHONE1, PHONE2 } from "../config"
import { useRouter } from "next/router"
import Loupe from "./Loupe"
import { toast } from "react-toastify"

export default function Header() {
  const router = useRouter()
  const { setUser, user } = useContext(AuthContext)
  const { currencyShop, setCurrencyShop, cart, currencyRate } =
    useContext(ProductsContext)
  const [delayTimer, setDelayTimer] = useState(new Date())
  const [isShowList, setIsShowList] = useState(false)
  const [isShowLoupe, setIsShowLoupe] = useState(false)
  const [image, setImage] = useState("")
  const [searchString, setSearchString] = useState("")
  const [products, setProducts] = useState([])

  const handleChange = (e) => {
    e.preventDefault()
    const string = e.target.value
    setSearchString(string)
    clearTimeout(delayTimer)
    setDelayTimer(
      setTimeout(async () => {
        const res = await fetch(
          `${API_URL}/api/products/search?string=${string.trim()}`
        )
        const { products } = await res.json()
        if (!res.ok) {
          toast.error("Server error")
          return
        }
        setProducts(products)
      }, 1000)
    )
  }

  const handleClick = (name) => {
    setIsShowList(false)
    setSearchString(name)
  }

  return (
    <header className={styles.header}>
      <div className={styles.header_top}>
        <div className={styles.header_top_left}>
          <div className={styles.currency_wrapper}>
            <div className={styles.currencies}>
              <p>
                USD:{" "}
                {Object.keys(currencyRate).length
                  ? currencyRate.USD.toFixed(2)
                  : ""}
              </p>
              <p>
                EUR:{" "}
                {Object.keys(currencyRate).length
                  ? currencyRate.EUR.toFixed(2)
                  : ""}
              </p>
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
          {Object.keys(user).length === 0 ? (
            <Link href="/account/login">
              <a className={styles.login}>
                <FaSignInAlt className={styles.icon} />
                <p>Войти</p>
              </a>
            </Link>
          ) : (
            <div className={styles.logout}>
              <p>{user.name}</p>
              <ul className={styles.dropdown_list}>
                <Link href={`/order_user_list/${user._id}`}>
                  <li>Мои заказы</li>
                </Link>
                <Link href={`/account/profile`}>
                  <li>Профиль</li>
                </Link>
                <li onClick={() => setUser({})}>Выйти</li>
              </ul>
            </div>
            // <button className={styles.logout} onClick={() => setUser({})}>
            // <FaSignOutAlt className={styles.icon} />

            // </button>
          )}
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
          <form className={styles.search}>
            <div
              className={styles.input_group}
              tabIndex={0}
              onFocus={() => setIsShowList(true)}
              onBlur={() => setIsShowList(false)}
            >
              <input type="text" value={searchString} onChange={handleChange} />
              {products.length ? (
                <ul
                  className={
                    styles.drop_down_list + " " + (isShowList && styles.active)
                  }
                >
                  {products.map((item, i) => (
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
                          {Object.keys(currencyRate).length ? (
                            <p>
                              {getPriceForShow({
                                currencyShop,
                                currencyRate,
                                currencyValue: item.currencyValue,
                                price: item.price,
                              })}
                              &nbsp;{getCurrencySymbol(currencyShop)}
                            </p>
                          ) : null}
                        </div>
                      </li>
                    </Link>
                  ))}
                </ul>
              ) : null}
              {isShowLoupe ? (
                <Loupe setIsShow={setIsShowLoupe} image={image} />
              ) : null}
              <button type="button">
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
