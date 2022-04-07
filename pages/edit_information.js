import AccessDenied from '@/components/AccessDenied'
import Layout from '@/components/Layout'
import Links from '@/components/Links'
import AuthContext from '@/context/AuthContext'
import styles from '@/styles/EditInformation.module.css'
import  { useRouter } from 'next/router'
import React, { useContext, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import { API_URL } from '../config'

export default function editInformationPage({ information }) {
  const { user: { isAdmin, token } }= useContext(AuthContext)
  const router=useRouter()
  
  const [values, setValues] = useState({
    aboutUs: information.aboutUs || '',
    conditions: information.conditions || '',
    productReturn: information.productReturn || '',
    delivery: information.delivery || '',
    address: information.address || '',
    workingHours: information.workingHours ||''
  })
  const changeHandler = (e) => {
    e.preventDefault()
    setValues({...values,[e.target.name]:e.target.value})
  }

  const submitHandler = async () => {
    const res = await fetch(`${API_URL}/api/information`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization:`Bearer ${token}`
      },
      body:JSON.stringify(values)
    })
    const data=res.json()
    if (!res.ok) {
      toast.error(data.message)
    }
    router.push('/')
  }
  
  return (
    <Layout title="Редактирование контактной информации">
      <ToastContainer/>
      {isAdmin ? (
        <>
          <div className={styles.header}>
            <Links home={true} back={true} />
            <input
              type="button"
              value="Сохранить"
              className="btn"
              onClick={submitHandler}
            />
          </div>

          <h2>Контактная информация</h2>
          <div className={styles.container}>
            <label htmlFor="aboutUs">О нас</label>
            <textarea
              name="aboutUs"
              id="aboutUs"
              onChange={changeHandler}
              value={values.aboutUs}
            ></textarea>
            <label htmlFor="conditions">Условия сотрудничества</label>
            <textarea
              id="conditions"
              name="conditions"
              onChange={changeHandler}
              value={values.conditions}
            ></textarea>
            <label htmlFor="productReturn">Возврат товара</label>
            <textarea
              id="productReturn"
              name="productReturn"
              onChange={changeHandler}
              value={values.productReturn}
            ></textarea>
            <label htmlFor="delivery">Доставка</label>
            <textarea
              id="delivery"
              name="delivery"
              onChange={changeHandler}
              value={values.delivery}
            ></textarea>
            <label htmlFor="address">Адрес</label>
            <textarea
              id="address"
              name="address"
              onChange={changeHandler}
              value={values.address}
            ></textarea>
            <label htmlFor="workingHours">Часы работы</label>
            <textarea
              id="workingHours"
              name="workingHours"
              onChange={changeHandler}
              value={values.workingHours}
            ></textarea>
          </div>
        </>
      ) : (
        <AccessDenied />
      )}
    </Layout>
  )
}

export async function getServerSideProps() {
  const res=await fetch(`${API_URL}/api/information`)
  const { information } = await res.json()
  if (!res.ok) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      information
    }
  }
}