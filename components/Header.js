import styles from "@/styles/Header.module.css"
import Link from "next/link"
import { useContext, useState } from "react"
import Spinner from "@/components/Spinner"
import AuthContext from "@/context/AuthContext"
import ProductsContext from "@/context/ProductsContext"
import DropDownList from "@/components/DropDownList"
import {
  FaPhone,
  FaShoppingCart,
  FaSignInAlt,
  FaSignOutAlt,
  FaTasks,
} from "react-icons/fa"
import { getCurrencySymbol } from "utils"
import { fetchNames } from "dataFetchers"
import { API_URL } from "../config"

export default function Header() {
  const { login, logout } = useContext(AuthContext)
  const { currencyShop, setCurrencyShop, currencyRate } =
    useContext(ProductsContext)

  const [isShowList, setIsShowList] = useState(false)

  const [searchString, setSearchString] = useState("")
  const [checkValues, setCheckValues] = useState({
    isProduct: true,
    isModel:false
  })

  const getSearchItemsList = (items, searchString, limit, isProduct = true, isModel = false) => {
    
    const listName = items
      .filter(
        ({ name }) =>
          isProduct&&name.toLowerCase().indexOf(searchString.toLowerCase()) >= 0
      )
      .map((item) => item.name)
      .slice(0, limit)
    const listModel = items
      .filter(
        ({ model }) =>
          isModel &&
          model.toLowerCase().indexOf(searchString.toLowerCase()) >= 0
      )
      .map((item) => item.model)
      .slice(0, limit)
    const list=[...listName,...listModel]
    return list
  }

  const handleSubmit =  async (e) => {
    e.preventDefault()
    let result=[]
    if (checkValues.isProduct) {
      const res = await fetch(
      `${API_URL}/api/products/search?product=${searchString}`
    )
      const { products } = await res.json()
      result=[...products]
    }
    if (checkValues.isModel) {
      const res = await fetch(
      `${API_URL}/api/products/search?model=${searchString}`
    )
      const { products } = await res.json()
      result=[...result,...products]
    }
   
   
    
  }
  const handleChange = (e) => {
    e.preventDefault()
    setSearchString(e.target.value)
  }
  const checkChange = (e) => {
   
    const { name, checked } = e.target
    
    setCheckValues({...checkValues,[name]:checked})
   
    
}
  const handleClick = (name) => {
    setIsShowList(false)
    setSearchString(name)
  }

  const { data, isLoading } = fetchNames()
  if (isLoading) return <Spinner />
  const { products } = data

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

      <form onSubmit={handleSubmit} className={styles.search}>
        <div
          className={styles.input_group}
          tabIndex={0}
          onFocus={() => setIsShowList(true)}
          onBlur={() => setIsShowList(false)}
        >
          <input type="text" value={searchString} onChange={handleChange} />
          <input type="submit" value="Найти" onChange={handleSubmit} />
          {products.length ? (
            <DropDownList
              isShow={isShowList}
              itemsList={getSearchItemsList(products, searchString, 20,checkValues.isProduct,checkValues.isModel)}
              handleClick={handleClick}
            />
          ) : null}
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
      <div className={styles.check_block}>
        <div>
          <p>Искать в</p> 
        </div>
        <div>
          <input
            type="checkbox"
            id="isProduct"
            name="isProduct"
            onChange={checkChange}
            checked={checkValues.isProduct}
          />
          <label htmlFor="isProduct">товарах</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="isModel"
            name="isModel"
            onChange={checkChange}
            checked={checkValues.isModel}
          />
          <label htmlFor="isModel">моделях</label>
        </div>        
      </div>
    </header>
  )
}
