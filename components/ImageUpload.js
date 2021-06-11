import styles from "@/styles/Form.module.css"
import { useState } from "react"
import { API_URL } from "@/config/index"

export default function ImageUpload({imageUploaded,index}) {

  const [image, setImage] = useState(null)

  const handleSubmit =  async (e) => {
    e.preventDefault()
    
    const formData = new FormData()
    formData.append('image', image)
    
    
    const res = await fetch(`${API_URL}/api/upload/`, {
      method: 'POST',
      headers: {
        'enctype':'multipart/form-data'
      },
      body:formData
    })
    const { path } = await res.json()
    
    if (res.ok) {
      
      imageUploaded(path,index)
    }
  }

  const handleChange = (e) => {
    
    setImage(e.target.files[0])
    
  }
  return (
    <div className={styles.form}>
      <p>Загрузка изображения</p>
      <form onSubmit={handleSubmit}>
        <div className={styles.file}>
          <input type="file" onChange={handleChange} />
        </div>
        <input type="submit" value="Загрузить файл" className="btn" />
      </form>
    </div>
  )
}
