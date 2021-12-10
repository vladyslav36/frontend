export function getCurrencySymbol(currencyShop) {
  switch (currencyShop) {
    case "UAH":
      return "₴"
      break
    case "EUR":
      return "€"
      break
    case "USD":
      return "$"
      break

    default:
      return "₴"
  }
}

export function getPriceForShow({
  currencyShop,
  currencyRate,
  currencyValue,
  price,
}) {
  const showPrice = (
    (currencyRate[currencyValue] * +price) /
    currencyRate[currencyShop]
  ).toFixed(2)
  return showPrice
}

export const getCategoriesTree = (category, categories) => {
  var result = [category.name]
  const findParent = (category) => {
    const parent = categories.find(
      (elem) => elem._id === category.parentCategoryId
    )
    if (parent) {
      result.push(parent.name)
      findParent(parent)
    }
    return
  }
  findParent(category)

  return result.reverse().join(" ➔ ")
}
export const getBrand = (category, categories) => {
  let result = category
  const findParent = (item) => {
    const parent = categories.find((elem) => elem._id === item.parentCategoryId)
    if (parent) {
      result = parent
      findParent(parent)
    }
    return
  }
  findParent(category)

  return result
}
export const getArrayCategoryTree = (category, categories) => {
  var result = [{ name: category.name, slug: category.slug }]
  const findParent = (category) => {
    const parent = categories.find(
      (elem) => elem._id === category.parentCategoryId
    )
    if (parent) {
      result.push({ name: parent.name, slug: parent.slug })
      findParent(parent)
    }
    return
  }
  findParent(category)

  return result.reverse()
}

export const getAllCategoriesTree = (categories) => {
  return Object.assign(
    {},
    ...categories.map((category) => ({
      [category._id]: getArrayCategoryTree(category, categories),
    }))
  )
}
export const getSearchItemsList = (items, searchString, limit) => {
  const list = items
    .filter(
      ({ name }) => name.toLowerCase().indexOf(searchString.toLowerCase()) >= 0
    )
    .map((item) => item.name)
    .slice(0, limit)
  return list
}

export const getShortDescription = (description, length) => {
  return description.length > length
    ? `${description.slice(0, length)}...`
    : description
}

export const stringToPrice = (string) => {
  if (!isNaN(+string)) {
    const priceNum = Math.abs(+string).toFixed(2)
    return { price: "" + priceNum == 0 ? "" : priceNum, error: false }
  } else {
    return { price: string, error: true }
  }
}

export const getQntInCart = (cart) =>
  cart.reduce((acc, item) => acc + +item.qnt, 0)
export const getTotalInCart = (cart) =>
  cart.reduce(
    (acc, item) => ({
      ...acc,
      [item.currencyValue]: acc[item.currencyValue] + item.qnt * item.price,
    }),
    {
      UAH: 0,
      USD: 0,
      EUR: 0,
    }
  )

export const getTotalAmount = (cart) => {
  const totalObj = getTotalInCart(cart)
  let strArr = []
  for (let key in totalObj) {
    if (totalObj[key]) {
      strArr.push(`${totalObj[key].toFixed(2)}${getCurrencySymbol(key)}`)
    }
  }
  return strArr.join(" + ") || "0"
}

export const getMailString = ({ cart, totalAmount, values,count }) => {
  const {
    name,
    surname,
    phone,
    city,
    carrier,
    branch,
    pickup,

    prepaid,
  } = values
  const options =
    cart.length && Object.keys(cart[0].options).length
      ? Object.keys(cart[0].options)
      : []
  return `
  <div style='font-size:16px;'>
  
  <div style='margin:auto;width:200px;color:blue'>Заказ № ${count+1} от ${new Date().toLocaleDateString()}</div>
    <div >
      <div><em>Получатель:</em>${name} ${surname}</div>
    <div><em>Телефон:</em>${phone}</div>
    <div><em>Доставка:</em> ${
      pickup ? "Самовывоз" : `${city} ${carrier} ${branch}`
    }</div>
    <div><em>Оплата:</em> ${prepaid ? "предоплата" : "наложенный платеж"}</div>
    </div>
    
    <table class="table" style='
        width:100%;
        border-collapse: collapse;
        table-layout: fixed;
        border:1px solid #999;
        margin:5px 0;
        text-align:center;      
        '>
      <thead >
        <tr>
          <td>Модель</td>
          ${
            options.length
              ? options.map(
                  (item) => `
                   <td>
                    ${item}
                  </td> `
                ).join("")
              : null
          }
          <td>Цена</td>
          <td>Кол-во</td>
        </tr>
      </thead>
      <tbody >
      ${cart
        .map(
          (item) => `
        <tr style='border:1px solid #999;'>
          <td >${item.name}</td>
        ${options.length ? options.map((option, i) => `
                    <td key={i}>
                      ${item.options[option]}
                    </td>`
                  ).join(""):null}
        <td>${item.price}${getCurrencySymbol(item.currencyValue)}</td>
        <td>${item.qnt}</td>
        </tr> 
        `
        )
        .join("")}              
      </tbody>
    </table>
    <div >Сумма заказа: <span style='color:red;'>${totalAmount}</span></div>
  </div>
  `
}
