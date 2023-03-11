import styles from "@/styles/Header.module.scss"
import Link from "next/link"
import { useContext, useRef, useState } from "react"
import AuthContext from "@/context/AuthContext"
import ProductsContext from "@/context/ProductsContext"
import { getCurrencySymbol, getPriceForShow, getQntInCart } from "utils"
import { API_URL, NOIMAGE, PHONE1, PHONE2 } from "../config"
import Loupe from "./Loupe"
import { toast } from "react-toastify"
import { useRouter } from "next/router"

export default function Header() {
  const { setUser, user } = useContext(AuthContext)
  const router = useRouter()
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
    const string = e.target.value.replace(/[^A-Za-zА-Яа-я 0-9]/g,'')
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
            maxLength='40'
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
                <li
                  onClick={() => router.push(`/product/${item.slug}`)}
                  key={i}
                >
                  <div className={styles.left_wrapper}>
                    <img
                      src={
                        item.imagesSm[0]
                          ? `${API_URL}${item.imagesSm[0]}`
                          : `${NOIMAGE}`
                      }
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
              <Link href="/">
                <span>Главная</span>
              </Link>
            </li>
            <li>
              <Link href="/contacts/address">
                <span>Контакты</span>
              </Link>
            </li>
            <li>
              <Link href="/contacts/map">
                <div>
                  <i className="fa-sharp fa-solid fa-location-dot fa-sm"></i>
                  &nbsp;<span>Карта</span>
                </div>
              </Link>
            </li>
            <li className={isUser ? styles.hide : styles.show}>
              <div
                onClick={() => {
                  elemMainUserMenu.current.classList.remove(styles.show)

                  router.push("/login")
                }}
              >
                <span>Войти</span>
              </div>
            </li>
            <li>
              <div
                className={
                  styles.user + " " + (isUser ? styles.show : styles.hide)
                }
              >
                <div onClick={toggleMainUserMenu}>
                  {" "}
                  <i className="fa-solid fa-user"></i>
                </div>

                <ul className={styles.main_user_menu} ref={elemMainUserMenu}>
                  <li>
                    <i className="fa-solid fa-user"></i>&nbsp;
                    <span>{user.userName}</span>
                  </li>
                  <li>
                    <Link href={`/order_user_list/${user._id}`}>
                      <p onClick={toggleMainUserMenu}>Мои заказы</p>
                    </Link>
                  </li>
                  <li>
                    <Link href="/user_profile">
                      <p onClick={toggleMainUserMenu}>Профиль</p>
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
                <span>{user.userName}</span>
              </li>
              <li>
                <Link href="/">
                  <p onClick={toggleBurgerMenu}>Главная</p>
                </Link>
              </li>
              <li>
                <Link href="/contacts/address">
                  <p onClick={toggleBurgerMenu}>Контакты</p>
                </Link>
              </li>
              <li>
                <Link href="/contacts/map">
                  <p onClick={toggleBurgerMenu}>На карте</p>
                </Link>
              </li>
              <li className={isUser ? styles.hide : styles.show}>
                <div
                  onClick={() => {
                    // elemBurgerMenu.current.classList.remove(styles.show)
                    toggleBurgerMenu()
                    router.push("/login")
                  }}
                >
                  <p>Войти</p>
                </div>
              </li>
              <div className={isUser ? styles.show : styles.hide}>
                <li>
                  <Link href={`/order_user_list/${user._id}`}>
                    <p onClick={toggleBurgerMenu}>Мои заказы</p>
                  </Link>
                </li>
                <li>
                  <Link href="/user_profile">
                    <p onClick={toggleBurgerMenu}>Профиль</p>
                  </Link>
                </li>
                <li
                  onClick={() => {
                    // elemBurgerMenu.current.classList.remove(styles.show)
                    toggleBurgerMenu()
                    setUser({})
                  }}
                >
                  Выйти
                </li>
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
            <div>
              <i className="fa-solid fa-arrows-rotate"></i>
            </div>
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
            <Link href="tel: +380509501671">{PHONE1}</Link>
            <Link href="tel: +380982086083">{PHONE2}</Link>
          </span>
        </div>
        <div className={styles.cart_wrapper}>
          <div className={styles.cart} title="Корзина">
            <Link href="/cart">
              <div>
                <i className="fa-solid fa-cart-shopping fa-2x"></i>
                <p>
                  {cart && getQntInCart(cart) !== 0 ? getQntInCart(cart) : ""}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
      {isShowLoupe ? <Loupe setIsShow={setIsShowLoupe} image={image} /> : null}
    </div>
  )
}
