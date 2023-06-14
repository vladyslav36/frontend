import styles from "@/styles/Slider.module.scss"
import { API_URL } from "../config"
import { useState, useEffect } from "react"
import ReactDom, { createPortal } from "react-dom"
import { FaChevronCircleLeft, FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa"

export default function Slider({
  images,
  setSliderValues,
  sliderValues,
  setMainImageIdx,
}) {
  const [num, setNum] = useState(sliderValues.idx)
  const [isBrowser, setIsBrowser] = useState(false)

  useEffect(() => {
    setIsBrowser(true)
  }, [])
  const lastNumber = images.length - 1
  const prevImage = () => {
    if (num === 0) {
      setNum(lastNumber)
    } else {
      setNum(num - 1)
    }
  }

  const nextImage = () => {
    if (num === lastNumber) {
      setNum(0)
    } else {
      setNum(num + 1)
    }
  }

  const closeSlider = (idx) => {
    setMainImageIdx(idx)
    setSliderValues({ ...sliderValues, isShow: false })
  }
  const imageHeight = window.innerHeight * 0.95

  const content = (
    <div className={styles.overlay}>      
      <div className={styles.container}>
        {lastNumber ? (         
            <FaChevronLeft onClick={prevImage} className={styles.prev_button}/>         
        ) : null}
        <div className={styles.image}>
          <img
            src={`${API_URL}${images[num]}`}
            style={{ maxHeight: imageHeight }}
          />
        </div>

        {lastNumber ? (          
            <FaChevronRight onClick={nextImage} className={styles.next_button}/>          
        ) : null}
      </div>    
        <FaTimes onClick={() => closeSlider(num)} className={styles.times_icon}/>      
    </div>    
  )

  if (isBrowser) {
    return createPortal(content, document.body)
  } else {
    return null
  }
}
