import { useState } from "react"
import { API_URL } from "@/config/index"
import styles from "@/styles/Form.module.css"

export default function ImageUpload({imageUploaded}) {
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
    console.log(path)
    if (res.ok) {
      
      imageUploaded(path)
    }
  }

  const handleChange = (e) => {
    console.log(e.target.files[0])
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
