import React from 'react'
import styles from '@/styles/ModalFile.module.scss'
import { FaTimes } from 'react-icons/fa'


export default function ModalImage({handleUploadChange,elDialog}) {
  return (
    <dialog ref={elDialog} className={styles.dialog}>
      <div className={styles.dialog_content}>
        <span onClick={() => elDialog.current.close()}>
          <FaTimes />
        </span>
        <p>Загрузка изображения</p>
        <input type="file" onChange={handleUploadChange} />
      </div>
    </dialog>
  )
}
