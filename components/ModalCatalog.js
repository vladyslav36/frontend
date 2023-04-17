import React from "react"
import styles from "@/styles/ModalFile.module.scss"
import { FaTimes } from "react-icons/fa"

export default function ModalCatalog({ handleUploadCatalog, elDialogCatalog }) {
  return (
    <dialog ref={elDialogCatalog} className={styles.dialog}>
      <div className={styles.dialog_content}>
        <span onClick={() => elDialogCatalog.current.close()}>
          <FaTimes />
        </span>
        <p>Загрузка каталога</p>
        <input type="file" onChange={handleUploadCatalog} />
      </div>
    </dialog>
  )
}
