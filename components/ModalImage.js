import React from 'react'
import styles from '@/styles/ModalFile.module.scss'
import { FaTimes } from 'react-icons/fa'



export default function ModalImage({handleUploadChange,setShowImageUpload}) {
  return (   
      <div className={styles.content}>
      <span onClick={() => {setShowImageUpload(false) }}>
          <FaTimes />
        </span>
        <p>Загрузка изображения</p>
        <input type="file" onChange={handleUploadChange} />
      </div>
    
  )
}
