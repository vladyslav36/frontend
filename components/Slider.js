import { FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa"
import styles from "@/styles/Slider.module.css"
import { API_URL } from "../config"
import { useState, useEffect } from "react"
import ReactDom from "react-dom"

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
      <div className={styles.slider}>
        <div className={styles.container}>
          {lastNumber ? (
            <button onClick={prevImage} className={styles.prev_button}>
              <FaArrowLeft />
            </button>
          ) : null}
          <div className={styles.image}>
            <img
              src={`${API_URL}${images[num]}`}
              style={{ maxHeight: imageHeight }}
            />
          </div>

          {lastNumber ? (
            <button onClick={nextImage} className={styles.next_button}>
              <FaArrowRight />
            </button>
          ) : null}
        </div>

        <FaTimes
          onClick={() => closeSlider(num)}
          className={styles.times_icon}
        />
      </div>
    </div>
  )

  if (isBrowser) {
    return ReactDom.createPortal(content, document.getElementById("slider"))
  } else {
    return null
  }
}
