import React from "react"
import styles from "@/styles/ModalFile.module.scss"
import { FaTimes } from "react-icons/fa"

export default function ModalCatalog({ handleUploadCatalog, setShowCatalogUpload }) {
  return (
   
      <div className={styles.content}>
      <span onClick={() => { setShowCatalogUpload(false)}}>
          <FaTimes />
        </span>
        <p>Загрузка каталога</p>
        <input type="file" onChange={handleUploadCatalog} />
      </div>
   
  )
}
