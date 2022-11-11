import styles from "@/styles/Modal.module.scss"
import { useState, useEffect } from "react"
import ReactDom from "react-dom"


export default function Modal({ show, onClose, children, title }) {
  const [isBrowser, setIsBrowser] = useState(false)
  useEffect(() => {
    setIsBrowser(true)
  }, [])
  const handleClose = (e) => {
    e.preventDefault()
    onClose()
}
  const contentModal = show ? (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <a href="#" onClick={handleClose}>
            <i className="fa-solid fa-xmark"></i>
          </a>
        </div>
        {title && <div>{title}</div>}
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  ) : null

  if (isBrowser) {
   return ReactDom.createPortal(contentModal,document.getElementById('modal-root'))
  } else {
    return null
 }
}
