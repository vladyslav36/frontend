import styles from "@/styles/DropDownList.module.css"


export default function DropDownList({ isShow, itemsList, handleClick }) {
  return (
    <>
      {itemsList.length ? (
        <ul className={styles.drop_down_list + " " + (isShow && styles.active)}>
      {itemsList.map((item,i) => (
        <li key={i} onClick={()=>handleClick(item)}>
          {item}
        </li>
      ))}
      </ul>
      ):null}
    
      </>
  )
}
