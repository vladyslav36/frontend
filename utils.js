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
    return { price: "" + Math.abs((+string).toFixed(2)), error: false }
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
export const getQntProdInCat = ({ categories, products }) => {
  const idToString = (id) => {
    return id === null ? "" : id.toString()
  }
  // Подсчет кол-ва товаров в каждой категории
  const qnt = categories.map((category) => {
    let count = 0
    const qntProducts = (category) => {
      const children = categories.filter(
        (item) => idToString(item.parentCategoryId) === idToString(category._id)
      )
      if (children.length) {
        children.forEach((child) => {
          qntProducts(child)
        })
      } else {
        const prodInCategory = products.filter(
          (item) => idToString(item.categoryId) === idToString(category._id)
        )

        count += prodInCategory.length
      }
    }
    qntProducts(category)
    return { [category._id]: count }
  })
  //
  return Object.assign({}, ...qnt)
}

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

export const getMailString = ({ cart, totalAmount, values }) => {
  const {
    name,
    surname,
    phone,
    city,
    carrier,
    branch,
    pickup,
    courier,
    prepaid,
    postpaid,
  } = values
  const isAttrInCart = (attr) => {
    return cart.some((item) => item[attr] !== "")
  }
  return `
  <div style='font-size:16px;'>
  
  <div style='margin:auto;width:200px;color:blue'>Заказ от ${new Date().toLocaleDateString()}</div>
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
          <td style='${
            isAttrInCart("height") ? "" : "visibility:hiden;width:0"
          }'>Рост</td>
          <td '${
            isAttrInCart("size") ? "" : "visibility:hiden;width:0"
          }'>Размер</td>
          <td '${
            isAttrInCart("color") ? "" : "visibility:hiden;width:0"
          }'>Цвет</td>
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
        <td>${item.height}</td>
        <td>${item.size}</td>
        <td>${item.color}</td>
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
