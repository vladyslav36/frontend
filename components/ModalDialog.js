import React from 'react'
import styles from '../styles/ModalDialog.module.scss'
import { createPortal } from 'react-dom'

export default function ModalDialog({children}) {
  const content =
    <div className={styles.overlay}>
      {children}
  </div>
  return  createPortal(content,document.body)
}
