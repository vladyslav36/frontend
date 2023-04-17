import React from "react"
import styles from "@/styles/ModalFile.module.scss"
import { FaTimes } from "react-icons/fa"

export default function ModalPrice({ handleUploadPrice, elDialogPrice }) {
  return (
    <dialog ref={elDialogPrice} className={styles.dialog}>
      <div className={styles.dialog_content}>
        <span onClick={() => elDialogPrice.current.close()}>
         <FaTimes />
        </span>
        <p>Загрузка прайса</p>
        <input type="file" onChange={handleUploadPrice} />
      </div>
    </dialog>
  )
}
