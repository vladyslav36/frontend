import Layout from "@/components/Layout"
import React, { useRef, useState } from "react"
import styles from "@/styles/CatalogForm.module.scss"
import { API_URL, NOIMAGE } from "../config"
import Links from "@/components/Links"
import ImageUpload from "@/components/ImageUpload"

export default function addCatalog({ catalogs }) {
  const [values, setValues] = useState({
    name: "",
    parentCatalog: "",
    parentCatalogId: null,
  })
  const [image, setImage] = useState({ path: "", file: null })

  const elDialog = useRef()

  const handleValues = (e) => {
    e.preventDefault()
    setValues({ ...values, [e.target.name]: e.target.value })
  }
  const handleUploadChange = (e) => {
    const url = URL.createObjectURL(e.target.files[0])
    URL.revokeObjectURL(image.path)
    setImage({ path: url, file: e.target.files[0] })

    elDialog.current.close()
  }
   const deleteImage = () => {
     URL.revokeObjectURL(image.path)
     setImage({ path: "", file: null })
   }
  console.log(image)
  return (
    <Layout title="Добавление каталога">
      <div className={styles.header}>
        <Links home={true} back={true} />
        <i className="fa-solid fa-floppy-disk fa-2xl" title="Сохранить"></i>
      </div>
      <div className={styles.container}>
        <div className={styles.left_side}>
          <div>
            <label htmlFor="name">Каталог</label>
            <input
              type="text"
              id="name"
              value={values.name}
              name="name"
              placeholder="Название каталога"
              onChange={handleValues}
            />
          </div>
          <div>
            <label htmlFor="parent">Родительский каталог</label>
            <div className={styles.input_wrapper}>
              <input
                type="text"
                id="parent"
                value={values.parentCatalog}
                name="parentCatalog"
                placeholder="Название родителя"
                onChange={handleValues}
              />
              <ul className={styles.drop_down_list}>
                {catalogs.length
                  ? catalogs.map((item) => (
                      <li
                        key={item._id}
                        onClick={() => {
                          setValues({ ...values, parentCatalog: item.name })
                        }}
                      >
                        {item.name}
                      </li>
                    ))
                  : null}
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.image_side}>
          <div className={styles.image}>
            {image.path ? (
              <img src={image.path} />
            ) : (
              <img src={NOIMAGE} alt="No image" />
            )}
          </div>
          <div className={styles.buttons}>
            <span
              title="Загрузить"
              onClick={() => elDialog.current.showModal()}
            >
              <i className="fa-solid fa-cloud-arrow-down fa-2xl"></i>
            </span>
            <span title="Удалить" onClick={deleteImage}>
              <i className="fa-solid fa-square-xmark fa-2xl"></i>
            </span>
          </div>
        </div>
      </div>

      <dialog ref={elDialog} className={styles.dialog}>
        <div className={styles.dialog_content}>
          <p>Загрузка изображения</p>
          <input type="file" onChange={handleUploadChange} />
        </div>
      </dialog>
    </Layout>
  )
}

export async function getServerSideProps() {
  const res = await fetch(`${API_URL}/api/catalogs`)
  const { catalogs } = await res.json()
  if (!res || !catalogs) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      catalogs,
    },
  }
}
