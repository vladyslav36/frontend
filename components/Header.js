import Link from 'next/link'
import { useState,useContext } from 'react'
import styles from '@/styles/Header.module.css'
import Search from '@/components/Search'
import AuthContext from '@/context/AuthContext'
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa'


export default function Header() {
  const { currencyName,setCurrencyName, login, logout }=useContext(AuthContext)
  
  
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">
          <a>Кармен</a>
        </Link>
      </div>
      <div className={styles.select}>
        <p>Валюта</p>
        <select
          value={currencyName}
          onChange={(e) => setCurrencyName(e.target.value)}
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
