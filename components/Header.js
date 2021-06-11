import styles from '@/styles/Header.module.css'
import Link from 'next/link'
import { useContext } from 'react'
import Search from '@/components/Search'
import AuthContext from '@/context/AuthContext'
import ProductsContext from '@/context/ProductsContext'
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa'
import { getCurrencySymbol } from 'utils'


export default function Header() {
  const { login, logout }=useContext(AuthContext)
  const { currencyShop,setCurrencyShop,currencyRate }=useContext(ProductsContext)
  
  
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
        <p>{getCurrencySymbol(currencyShop)}  Валюта </p>
        <select
          value={currencyShop}
          onChange={(e) => setCurrencyShop(e.target.value)}
        >
          <option value="UAH">UAH</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
      </div>

      <Search />
      <nav>
        <ul>
          <li>
            <Link href="/account/login">
              <a className="btn btn-icon">
                <FaSignInAlt/> Войти
              </a>
            </Link>
          </li>
          <li>
            
              <button className="btn btn-icon" onClick={() => logout()}>
                <FaSignOutAlt/>  Выйти
              </button>
           
          </li>
        </ul>
      </nav>
    </header>
  )
}
