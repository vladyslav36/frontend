import styles from "@/styles/Footer.module.scss"
import { FaPhone,FaSistrix,FaRegClock, FaRegCreditCard } from 'react-icons/fa'
import Link from "next/link"
import { PHONE1, PHONE2 } from "../config"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.information}>
          <h3>Информация</h3>
          <Link href="/informations/about">
            <a>О нас</a>
          </Link>
          <Link href="/informations/conditions">
            <a>Условия сотрудничества</a>
          </Link>
          <Link href="/informations/productReturn">
            <a>Возврат товара</a>
          </Link>
          <Link href="/informations/delivery">
            <a>Доставка заказов</a>
          </Link>
        </div>
        <div className={styles.contacts}>
          <h3>Контакты</h3>
          <div className={styles.phones_wrapper}>
            <FaPhone />
            <div className={styles.phones}>
              <div>{PHONE1}</div>
              <div>{PHONE2}</div>
            </div>
          </div>
          <Link href="/contacts/address">
            <a>
              <FaRegClock />&nbsp; Адрес, режим работы
            </a>
          </Link>
          <Link href="/contacts/map">
            <a>
              <FaSistrix />&nbsp; Мы на карте
            </a>
          </Link>
        </div>        
      </div>
      <div className={styles.bottom}>
        <p>Все права защищены. Кармен &copy; 2021</p>
      </div>
    </footer>
  )
}
