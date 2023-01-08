import React from "react"
import styles from "@/styles/ModalFile.module.scss"

export default function ModalCatalog({ handleUploadCatalog, elDialogCatalog }) {
  return (
    <dialog ref={elDialogCatalog} className={styles.dialog}>
      <div className={styles.dialog_content}>
        <span onClick={() => elDialogCatalog.current.close()}>
          <i className="fa-solid fa-xmark fa-xl"></i>
        </span>
        <p>Загрузка каталога</p>
        <input type="file" onChange={handleUploadCatalog} />
      </div>
    </dialog>
  )
}
