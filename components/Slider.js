import { FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa"
import Image from 'next/image'
import styles from "@/styles/Slider.module.css"
import { API_URL } from "../config"
import { useState } from "react"

export default function Slider({ images, setSliderValues,sliderValues }) {
  const [num, setNum] = useState(sliderValues.idx)
  const lastNumber = images.length - 1
  console.log()
  const prevImage = () => {
    if (num===0) {
      setNum(lastNumber)
    } else {
      setNum(num-1)
    }
  }

  const nextImage = () => {
    if (num === lastNumber) {
      setNum(0)
    } else {
      setNum(num+1)
    }
  }
  const imageHeight = window.innerHeight * 0.95
  
  return (
    <div className={styles.slider}>
      <div className={styles.container}>        
        <button onClick={prevImage} className={styles.prev_button}><FaArrowLeft/></button>
        <div className={styles.image}>          
          <img src={`${API_URL}${images[num]}`} style={{maxHeight:imageHeight} }/>
        </div>
        
          <button onClick={nextImage} className={styles.next_button}><FaArrowRight/></button>
        
      </div>

      <FaTimes onClick={() => setSliderValues({ ...sliderValues, isShow: false })} className={styles.times_icon}/>
    </div>
  )
}
