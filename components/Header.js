import styles from "@/styles/Header.module.css"
import Link from "next/link"
import { useContext, useState } from "react"
import Spinner from "@/components/Spinner"
import AuthContext from "@/context/AuthContext"
import ProductsContext from "@/context/ProductsContext"
import DropDownList from '@/components/DropDownList'
import {
  FaPhone,
  FaShoppingCart,
  FaSignInAlt,
  FaSignOutAlt,
  FaTasks,
} from "react-icons/fa"
import { getCurrencySymbol, getSearchItemsList } from "utils"
import { fetchNames } from "dataFetchers"

export default function Header() {
  const { login, logout } = useContext(AuthContext)
  const { currencyShop, setCurrencyShop, currencyRate } =
    useContext(ProductsContext)

  const [isShowList, setIsShowList] = useState(false)

  const [searchString, setSearchString] = useState("")
  const handleSubmit = (e) => {
    e.preventDefault()
  }
  const handleChange = (e) => {
    e.preventDefault()
    setSearchString(e.target.value)
  }

  const handleClick = (name) => {
    setSearchString(name)
  }

  const { data, isLoading } = fetchNames()
  if (isLoading) return <Spinner />
  const { products } = data
console.log(products)
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">
          <a>Кармен</a>
        </Link>
      </div>
      <div className={styles.currencies}>
        <p>USD: {currencyRate.USD.toFixed(2)}</p>
        <p>EUR: {currencyRate.EUR.toFixed(2)}</p>
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
      <div className={styles.phone_1}>
        <FaPhone />
        &nbsp;<p>050-950-16-71</p>
      </div>
      <div className={styles.phone_2}>
        <FaPhone />
        &nbsp;<p>098-208-60-83</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className={styles.search}
        
      >
        <div className={styles.input_group} tabIndex={0}
        onFocus={()=>setIsShowList(true)}
        onBlur={()=>setIsShowList(false)}>
<input type="text" value={searchString} onChange={handleChange} />
        <input type="button" value="Найти" onChange={handleSubmit} />
        {products.length ? (
          <DropDownList isShow={isShowList} itemsList={getSearchItemsList(products,searchString,20)} handleClick={handleClick}/>
        ):null}
        </div>
        
      </form>

      <nav>
        <ul>
          <li>
            <Link href="/account/login">
              <a className={styles.login}>
                <FaSignInAlt className={styles.icon} />
                <p>Войти</p>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/account/register">
              <a className={styles.register} onClick={() => logout()}>
                <FaTasks className={styles.icon} />
                <p>Регистрация</p>
              </a>
            </Link>
          </li>
        </ul>
      </nav>
      <div className={styles.cart}>
        <Link href="/">
          <a>
            <FaShoppingCart className={styles.icon} />
            <p>Товаров 0(0грн)</p>
          </a>
        </Link>
      </div>
    </header>
  )
}
