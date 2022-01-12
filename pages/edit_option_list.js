import Layout from "@/components/Layout"
import AuthContext from "@/context/AuthContext"
import { useContext, useRef, useState } from "react"
import { API_URL, NOIMAGE_PATH } from "../config"
import styles from "@/styles/EditOption.module.css"
import "react-toastify/dist/ReactToastify.css"
import { toast, ToastContainer } from "react-toastify"
import {
 
  FaPencilAlt,
 
  FaTimes,
} from "react-icons/fa"

import router, { useRouter } from "next/router"

import AccessDenied from "@/components/AccessDenied"
import Links from "@/components/Links"
import DropDownList from "@/components/DropDownList"

export default function editOptionList({ data }) {
  const {
    user: { isAdmin, token },
  } = useContext(AuthContext)
  const [options,setOptions]=useState(data)
  
 const deleteOption = async (item) => {
   
   const res = await fetch(`${API_URL}/api/options/${item._id}`, {
     headers: {
       authorization: `Bearer ${token}`,
     },
     method: "DELETE",
   })
   if (!res.ok) {
     toast.error('Не удалось удалить опцию')
     
   } else {
     setOptions(options.filter((option) => option._id !== item._id))
   }
   
  }
const  editOption = (item) => {
    router.push(`/edit_option/${item._id}`)
  }
  console.log(options)
  return (
    <Layout title="Редактирование опций">
      {!isAdmin ? (
        <AccessDenied />
      ) : (
        <div>
          <ToastContainer />
          <div className={styles.header}>
            <Links home={true} />
          </div>
            <div className={styles.content}>
              {options.length ? (
                options.map(( item, i)=>(
              <div className={styles.option_item} key={i}>
                    <p>{item.name}</p>
              <div className={styles.icons_wrapper}>
                <div className={styles.icon}>
                        <FaPencilAlt onClick={()=>editOption(item) }/>
                </div>
                <div className={styles.icon} onClick={()=>deleteOption(item)}>
                  <FaTimes />
                </div>
              </div>
            </div>
                )) 
              )
                             :null}
            
          </div>
        </div>
      )}
    </Layout>
  )
}

export async function getServerSideProps() {
  const res = await fetch(`${API_URL}/api/options`)
  const { data } = await res.json()
  return {
    props: {
       data,
    },
  }
}
