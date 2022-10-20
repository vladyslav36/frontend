import styles from "@/styles/Header.module.css"
import Link from "next/link"
import { useContext, useRef, useState } from "react"
import AuthContext from "@/context/AuthContext"
import ProductsContext from "@/context/ProductsContext"
import { getCurrencySymbol, getPriceForShow, getQntInCart } from "utils"
import { API_URL, NOIMAGE, PHONE1, PHONE2 } from "../config"
import Loupe from "./Loupe"
import { toast } from "react-toastify"

export default function Header() {
  const { setUser, user } = useContext(AuthContext)
  const { currencyShop, setCurrencyShop, cart, currencyRate } =
    useContext(ProductsContext)
  const [delayTimer, setDelayTimer] = useState(new Date())
  const [isShowList, setIsShowList] = useState(false)
  const [isShowLoupe, setIsShowLoupe] = useState(false)
  const [image, setImage] = useState("")
  const [searchString, setSearchString] = useState("")
  const [products, setProducts] = useState([])  
  const elemMainUserMenu = useRef()
  const elemBurgerMenu = useRef()
  const isUser = Object.keys(user).length === 0 ? false : true

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
    
  }

  const toggleMainUserMenu = () => {
    elemMainUserMenu.current.classList.toggle(styles.show)
  }

  const toggleBurgerMenu = () => {
    elemBurgerMenu.current.classList.toggle(styles.show)
  }

  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">
            <div className={styles.logo_image}>
              <img src="/logo.png" alt="кармен" title="На главную" />
            </div>
          </Link>
        </div>
        <div
          className={styles.search}
          tabIndex={0}
          onFocus={() => setIsShowList(true)}
          onBlur={() => setIsShowList(false)}
        >
          <input
            type="text"
            value={searchString}
            onChange={handleChange}
            title="Поиск по модели или артикулу"
          />
          <p>
            <i className="fa-sharp fa-solid fa-magnifying-glass"></i>
          </p>
          {products.length ? (
            <ul
              className={styles.search_list + " " + (isShowList && styles.show)}
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
              <li>
                <p>Показаны результаты поиска первых 10 товаров</p>{" "}
              </li>
            </ul>
          ) : null}
        </div>
        <div className={styles.nav}>
          <ul className={styles.main_menu}>
            <li>
              <Link href="/">Главная</Link>
            </li>
            <li>
              <Link href="/contacts/address">
                <a>Контакты</a>
              </Link>
            </li>
            <li>
              <Link href="/contacts/map">
                <a>
                  <i className="fa-sharp fa-solid fa-location-dot fa-sm"></i>
                  &nbsp;Карта
                </a>
              </Link>
            </li>
            <li className={isUser ? styles.hide : styles.show}>
              <Link href="/account/login">Войти</Link>
            </li>
            <li>
              <div
                className={
                  styles.user + " " + (isUser ? styles.show : styles.hide)
                }
              >
                <Link href="#">
                  <a onClick={toggleMainUserMenu}>
                    {" "}
                    <i className="fa-solid fa-user"></i>
                  </a>
                </Link>
                <ul className={styles.main_user_menu} ref={elemMainUserMenu}>
                  <li>
                    <i className="fa-solid fa-user"></i>&nbsp;
                    <span>{user.email}</span>
                  </li>
                  <li>
                    <Link href={`/order_user_list/${user._id}`}>
                      <a>Мои заказы</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/account/profile">
                      <a>Профиль</a>
                    </Link>
                  </li>
                  <li onClick={() => setUser({})}>Выйти</li>
                </ul>
              </div>
            </li>
          </ul>

          <div className={styles.burger}>
            <div onClick={toggleBurgerMenu}>
              <i className="fa-solid fa-bars fa-2xl"></i>
            </div>

            <ul className={styles.burger_menu} ref={elemBurgerMenu}>
              <li className={isUser ? styles.show : styles.hide}>
                <i className="fa-solid fa-user"></i>&nbsp;
                <span>{user.email}</span>
              </li>
              <li>
                <Link href="/">
                  <a>Главная</a>
                </Link>
              </li>
              <li>
                <Link href="/contacts/address">
                  <a>Контакты</a>
                </Link>
              </li>
              <li>
                <Link href="/contacts/map">
                  <a>На карте</a>
                </Link>
              </li>
              <li className={isUser ? styles.hide : styles.show}>
                <Link href="/account/login">
                  <a>Войти</a>
                </Link>
              </li>
              <div className={isUser ? styles.show : styles.hide}>
                <li>
                  <Link href={`/order_user_list/${user._id}`}>
                    <a>Мои заказы</a>
                  </Link>
                </li>
                <li>
                  <Link href="/account/profile">
                    <a>Профиль</a>
                  </Link>
                </li>
                <li onClick={() => setUser({})}>Выйти</li>
              </div>
            </ul>
          </div>
        </div>

        <div className={styles.currencies}>
          <div>
            <span>Цена в</span>
            <span>
              <select
                value={currencyShop}
                onChange={(e) => setCurrencyShop(e.target.value)}
              >
                <option value="UAH">UAH</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </span>
          </div>
          <div className={styles.rates}>
            <p>
              <i className="fa-solid fa-arrows-rotate"></i>
            </p>
            <p>
              USD:{" "}
              {Object.keys(currencyRate).length
                ? currencyRate.USD.toFixed(2)
                : ""}{" "}
              EUR:{" "}
              {Object.keys(currencyRate).length
                ? currencyRate.EUR.toFixed(2)
                : ""}
            </p>
          </div>
        </div>
        <div className={styles.phones}>
          <span>
            <i className="fa-solid fa-phone fa-ml"></i>
          </span>
          <span>
            <Link href="tel: +390508501671">{PHONE1}</Link>
            <Link href="tel: +380982086083">{PHONE2}</Link>
          </span>
        </div>
        <div className={styles.cart} title='Корзина'>
          <Link href="/cart">
            <a>
              <i className="fa-solid fa-cart-shopping fa-2x"></i>
              <p>
                {cart && getQntInCart(cart) !== 0 ? getQntInCart(cart) : ""}
              </p>
            </a>
          </Link>
        </div>
      </div>
      {isShowLoupe ? <Loupe setIsShow={setIsShowLoupe} image={image} /> : null}
    </div>
  )
}
