import React from "react"
import styles from "@/styles/ModalFile.module.scss"
import { FaTimes } from "react-icons/fa"

export default function ModalPrice({ handleUploadPrice, setShowPriceUpload }) {
  return (    
      <div className={styles.content}>
        <span onClick={() => setShowPriceUpload(false)}>
         <FaTimes />
        </span>
        <p>Загрузка прайса</p>
        <input type="file" onChange={handleUploadPrice} />
      </div>
  
  )
}
