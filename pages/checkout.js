import Layout from "@/components/Layout"
import Links from "@/components/Links"
import AuthContext from "@/context/AuthContext"
import ProductsContext from "@/context/ProductsContext"
import styles from "@/styles/Checkout.module.css"
import { useContext, useEffect, useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { getMailString, getQntInCart, getTotalAmount } from "utils"
import { API_URL } from "../config"

export default function Checkout() {
  const { cart,setCart } = useContext(ProductsContext)
  const { user }=useContext(AuthContext)
  const [values, setValues] = useState({
    name: "",
    surname: "",
    phone: "",
    city: "",
    carrier: "",
    branch: "",
    pickup: true,   
    prepaid: true,
    
  })
  const [disable,setDisable]=useState(false)

  useEffect(() => {    
       const data = localStorage.getItem("checkout")
      if (data) setValues(JSON.parse(data))   
  }, [])
  const handleChange = (e) => {
    const { name, value, checked } = e.target
    if (name === "delMethod") {
      setValues({
        ...values,
        ["pickup"]: value === "pickup"
        
      })
    } else {
      if (name === "payment") {
        setValues({
          ...values,
          ["prepaid"]: value === "prepaid"
          
        })
      } else {
        e.preventDefault()
        setValues({ ...values, [name]: value })
      }
    }
  }

  const handleSendOrder = async () => {
    const totalAmount = getTotalAmount(cart)
    const totalQnt = getQntInCart(cart)
    const res1 = await fetch(`${API_URL}/api/order/count`)
    const { count }=await res1.json()
    const mailString=getMailString({cart,totalAmount,values,count})
    localStorage.setItem("checkout", JSON.stringify(values))
    const res = await fetch(`${API_URL}/api/cart/mail`, {
      method:'POST',
      headers: {
        'Content-Type':'application/json',
      },
      body:JSON.stringify({mailString})
    })
    // if (res.ok) {
    //   toast.success("?????????? ?????????????? ??????????????????")
    // } else {
    //   toast.error("???????????? ?????? ???????????????? ????????????")
    // }
    
      const res2 = await fetch(`${API_URL}/api/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'        
      },
      body: JSON.stringify({
        orderItems: cart,
        delivery: values,
        totalQnt,
        totalAmount,
        count:count+1,
        userId:Object.keys(user).length?user._id:null
      })
      })
      //  if (res2.ok) {
      //    toast.success("?????????? ?????????????? ????????????????")
      //  } else {
      //    toast.error("???????????? ?????? ???????????????????? ????????????")
      //  }
    if (res.ok && res2.ok) {
      toast.success('?????????? ?????????????????? ??????????????')
      setCart([])
      setDisable(true)
    } else {
      toast.error('???????????? ?????? ?????????????????? ????????????')
     }
  }
  
  return (
    <Layout title="???????????????????? ????????????">
      <ToastContainer/>
      <div className={styles.container}>
        <div className={styles.header}>
          <Links home={true} back={true} />
          <button className={styles.button} onClick={handleSendOrder} disabled={disable}>
            ?????????????????? ??????????
          </button>
        </div>
        <div className={styles.content}>
          <div className={styles.input}>
            <label htmlFor="name">?????? ????????????????????</label>
            <input
              type="text"
              id="name"
              name="name"
              value={values.name}
              onChange={handleChange}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="surname">?????????????? ????????????????????</label>
            <input
              type="text"
              id="surname"
              name="surname"
              value={values.surname}
              onChange={handleChange}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="phone">??????????????</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={values.phone}
              onChange={handleChange}
            />
          </div>
          <div className={styles.input}>
            <p> ???????????? ????????????????</p>
            <div className={styles.input_radio_wrapper}>
              <div className={styles.input_radio}>
                <label htmlFor="pickup">??????????????????</label>
                <input
                  type="radio"
                  id="pickup"
                  name="delMethod"
                  value="pickup"
                  checked={values.pickup}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.input_radio}>
                <label htmlFor="courier">????????????????????????</label>
                <input
                  type="radio"
                  id="courier"
                  name="delMethod"
                  value="courier"
                  checked={!values.pickup}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          {!values.pickup ? (
            <>
              <div className={styles.input}>
                <label htmlFor="city">???????????????????? ??????????</label>
                <input
                  type="text"
                  name="city"
                  value={values.city}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.input}>
                <label htmlFor="carrier">????????????????????</label>
                <input
                  type="text"
                  name="carrier"
                  value={values.carrier}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.input}>
                <label htmlFor="branch">??????????????????</label>
                <input
                  type="text"
                  name="branch"
                  value={values.branch}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.input}>
                <p> ?????????? ????????????</p>
                <div className={styles.input_radio_wrapper}>
                  <div className={styles.input_radio}>
                    <label htmlFor="prepaid">????????????????????</label>
                    <input
                      type="radio"
                      id="prepaid"
                      name="payment"
                      value="prepaid"
                      checked={values.prepaid}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.input_radio}>
                    <label htmlFor="postpaid">???????????????????? ????????????</label>
                    <input
                      type="radio"
                      id="postpaid"
                      name="payment"
                      value="postpaid"
                      checked={!values.prepaid}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
      {/* test */}
      
    </Layout>
  )
}
