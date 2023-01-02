import styles from "@/styles/Footer.module.scss"
import Link from "next/link"
import { PHONE1, PHONE2 } from "../config"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.information}>
          <h3>Информация</h3>
          <Link href="/informations/about">
            <p>О нас</p>
          </Link>
          <Link href="/informations/conditions">
            <p>Условия сотрудничества</p>
          </Link>
          <Link href="/informations/productReturn">
            <p>Возврат товара</p>
          </Link>
          <Link href="/informations/delivery">
            <p>Доставка заказов</p>
          </Link>
        </div>
        <div className={styles.contacts}>
          <h3>Контакты</h3>
          <div className={styles.phones_wrapper}>
            <i className="fa-solid fa-phone-flip"></i>
            <div className={styles.phones}>
              <div>{PHONE1}</div>
              <div>{PHONE2}</div>
            </div>
          </div>
          <Link href="/contacts/address">
            <div>
              <i className="fa-regular fa-clock"></i>
              &nbsp; Адрес, режим работы
            </div>
          </Link>
          <Link href="/contacts/map">
            <div>
              <i className="fa-solid fa-magnifying-glass"></i>
              &nbsp; Мы на карте
            </div>
          </Link>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>Все права защищены. Кармен &copy; 2021</p>
      </div>
    </footer>
  )
}
