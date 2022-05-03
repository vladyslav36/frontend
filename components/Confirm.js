import React from "react"
import ReactDom from "react-dom"
import { useState, useEffect } from "react"
import styles from "@/styles/Confirm.module.css"

export default function Confirm({
  setIsShowConfirm,
  itemName,
  handleDelete,
  setDeleteArg,
}) {
  const [isBrowser, setIsBrowser] = useState(false)

  useEffect(() => {
    setIsBrowser(true)
  })

  const handleYes = () => {
    setIsShowConfirm(false)
    handleDelete()
  }
  const handleNo = () => {
    setIsShowConfirm(false)
    setDeleteArg({})
  }
  const content = (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.question}>Уверены что хотите удалить</div>
        <div>{itemName}</div>
        <div className={styles.buttons}>
          <div className={styles.button + " " + styles.yes} onClick={handleYes}>
            Да{" "}
          </div>
          <div className={styles.button + " " + styles.no} onClick={handleNo}>
            Нет
          </div>
        </div>
      </div>
    </div>
  )
  if (isBrowser) {
    return ReactDom.createPortal(content, document.getElementById("confirm"))
  } else {
    return null
  }
}
