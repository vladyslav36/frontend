import styles from "@/styles/Form.module.scss"


export default function ImageUpload({setShowModal,setImage,image}) { 

  const handleChange = (e) => {
    const url = URL.createObjectURL(e.target.files[0])
    URL.revokeObjectURL(image.path)
    setImage({ path:url, file: e.target.files[0] })
   
    setShowModal(false)
  }
  return (
    <div className={styles.form}>
      <p>Загрузка изображения</p>      
        <div className={styles.file}>
          <input type="file" onChange={handleChange} />
        </div>     
    </div>
  )
}


