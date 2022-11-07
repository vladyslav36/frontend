import styles from "@/styles/Form.module.scss"

export default function ImagesUpload({ setShowModal, setImages, images,idx }) {
  const handleChange = (e) => {
    const url = URL.createObjectURL(e.target.files[0])
    // что нажато: добавление новой картинки или изменение существующей
    if (images[idx]) {
      URL.revokeObjectURL(images[idx].path)
      setImages(images.map((item,i)=>i===idx?{ path: url, file: e.target.files[0] }:item))
    } else {
      setImages([...images,{path:url,file:e.target.files[0]}])
    }
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
