import styles from "@/styles/CatalogForm.module.scss"
import React, { useContext, useRef, useState } from "react"
import { API_URL, NOIMAGE } from "../config"
import Links from "@/components/Links"
import AuthContext from "@/context/AuthContext"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import AccessDenied from "@/components/AccessDenied"
import { getListForCatalogsMenu } from "utils"
import ModalImage from "./ModalImage"
import { FaCloudDownloadAlt, FaSave, FaTimes, FaWindowClose } from "react-icons/fa"

export default function EditCatalog({
  catalog,
  catalogs,
  setCatalogs,
  setIsShowCatalog,
  token,
}) {
  const [values, setValues] = useState({
    _id: catalog._id,
    name: catalog.name,
    parent: catalog.parent,
    parentId: catalog.parentId,
  })
  const [image, setImage] = useState({
    path: catalog.image ? `${API_URL}${catalog.image}` : "",
    file: null,
  })

  const elDialog = useRef()
  const listForMenu = getListForCatalogsMenu(catalogs)
  const handleValues = (e) => {
    e.preventDefault()
    if (e.target.name === "name") {
      setValues({ ...values, [e.target.name]: e.target.value })
    } else {
      toast.warning("Родительский каталог выбирается из выпадающего списка")
    }
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

  const sendData = async () => {
    // Проверка на заполнение поля имени каталога
    const hasEmptyFields = !values.name.trim()
    if (hasEmptyFields) {
      toast.error("Поле Каталог должно быть заполнено")
      return
    }

    if (values._id === values.parentId) {
      toast.error("Каталог не может быть родителем самого себя")
      setValues({ ...values, parentId: null, parent: "" })

      return
    }
    const formData = new FormData()
    formData.append("values", JSON.stringify(values))
    formData.append("imageClientPath", image.path)
    formData.append("image", image.file)
    const res = await fetch(`${API_URL}/api/catalogs`, {
      method: "PUT",
      headers: {
        enctype: "multipart/form-data",
        authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (res.ok) {
      toast.success("Каталог успешно обновлен")
      // обновление каталогов с базы
      const res = await fetch(`${API_URL}/api/catalogs`)
      const { catalogs: newCatalogs } = await res.json()
      setCatalogs(newCatalogs)
    } else {
      toast.error("Ошибка при загрузке каталога")
    }
  }

  return (
    <>
      <ToastContainer />
      <div className={styles.header}>
        <Links home={true} back={true} />

        <div className={styles.right_icons}>
          <FaWindowClose
            className={styles.icon}
            title="Отмена"
            name="cancel"
            onClick={() => setIsShowCatalog(false)}
          />
          <FaSave
            className={styles.icon}
            title="Сохранить"
            name="save"
            onClick={sendData}
          />
        </div>
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
                value={values.parent}
                name="parent"
                placeholder="Название родителя"
                onChange={handleValues}
              />
              <div
                className={styles.cancell}
                onClick={() =>
                  setValues({ ...values, parent: "", parentId: null })
                }
              >
                <FaTimes  />
              </div>
              <ul className={styles.drop_down_list}>
                {listForMenu.length
                  ? listForMenu.map((item, i) => (
                      <li
                        key={i}
                        onClick={() => {
                          setValues({
                            ...values,
                            parent: item.cat.name,
                            parentId: item.cat._id,
                          })
                        }}
                      >
                        {item.tree}
                      </li>
                    ))
                  : null}
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.image_side}>
          <div className={styles.image}>
            {image.path ? <img src={image.path} /> : <img src={NOIMAGE} />}
          </div>
          <div className={styles.buttons}>             
              <FaCloudDownloadAlt
                className={styles.icon}
                name="download"
                title="Загрузить"
                onClick={() => elDialog.current.showModal()}
              />            
              <FaWindowClose
                className={styles.icon}
                name="delete"
                title="Удалить"
                onClick={deleteImage}
              />
          
          </div>
        </div>
      </div>

      <ModalImage elDialog={elDialog} handleUploadChange={handleUploadChange} />
    </>
  )
}
