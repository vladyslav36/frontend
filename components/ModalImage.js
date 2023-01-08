import React from 'react'
import styles from '@/styles/ModalFile.module.scss'


export default function ModalImage({handleUploadChange,elDialog}) {
  return (
    <dialog ref={elDialog} className={styles.dialog}>
      <div className={styles.dialog_content}>
        <span onClick={() => elDialog.current.close()}>
          <i className="fa-solid fa-xmark fa-xl"></i>
        </span>
        <p>Загрузка изображения</p>
        <input type="file" onChange={handleUploadChange} />
      </div>
    </dialog>
  )
}
