import {  FaTimes } from "react-icons/fa"
import styles from "@/styles/Slider.module.css"
import { API_URL, NOIMAGE } from "../config"
import ReactDom from "react-dom"
import { useState, useEffect } from "react"


export default function Loupe({
  image,
  setIsShow
}) {
 
  const imageHeight = window.innerHeight * 0.95
const [isBrowser, setIsBrowser] = useState(false)

useEffect(() => {
  setIsBrowser(true)
}, [])
  
  const content= (
    <div className={styles.slider}>
      <div className={styles.container}>       
        <div className={styles.image}>
          <img
            src={image?`${API_URL}${image}`:`${NOIMAGE}`}
            style={{ maxHeight: imageHeight }}
          />
        </div>        
      </div>

      <FaTimes onClick={(e) => {
        e.stopPropagation()
        setIsShow(false)
      }}
        className={styles.times_icon} />
    </div>
  )

   if (isBrowser) {
     return ReactDom.createPortal(content, document.getElementById("loupe"))
   } else {
     return null
   }
}
