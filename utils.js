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

export const idToString = (id) => {
  return id === null ? "" : id.toString()
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

export const getCatTree = (cat, catArray) => {
  var result = [cat.name]
  const findParent = (cat) => {
    const parent = catArray.find((elem) => elem._id === cat.parentId)
    if (parent) {
      result.push(parent.name)
      findParent(parent)
    }
    return
  }
  findParent(cat)

  return result.reverse().join(" ➔ ")
}

export const getBrand = (category, categories) => {
  let result = category
  const findParent = (item) => {
    const parent = categories.find((elem) => elem._id === item.parentId)
    if (parent) {
      result = parent
      findParent(parent)
    }
    return
  }
  findParent(category)

  return result
}
export const getArrayCatTree = (cat, catArray) => {
  var result = [cat]
  const findParent = (cat) => {
    const parent = catArray.find((elem) => elem._id === cat.parentId)
    if (parent) {
      result.push(parent)
      findParent(parent)
    }
    return
  }
  findParent(cat)

  return result.reverse()
}

export const getAllCategoriesTree = (categories) => {
  return Object.assign(
    {},
    ...categories.map((category) => ({
      [category._id]: getArrayCatTree(category, categories),
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
  const priceNum =parseFloat(string.replace(/[^\d.,]+/g, "").replace(",", "."))||0
  
   return priceNum == 0 ? "" : priceNum.toFixed(2)
  
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
// Функция возвращает отсортированный list for drop_down_menu формата {cat:category,tree:string tree}
export const getListForCategoriesMenu = (catArray) => {
  const list = catArray
    .map((item) => ({ cat: item, tree: getCatTree(item, catArray) }))
    .sort((a, b) => (a.tree.toLowerCase() > b.tree.toLowerCase() ? 1 : -1))
  return list
}
export const getListForCatalogsMenu = (catArray) => {
  const list = catArray
    .map((item) => ({ cat: item, tree: getCatTree(item, catArray) }))
    .sort((a, b) => (a.tree.toLowerCase() > b.tree.toLowerCase() ? 1 : -1))
  return list
}

export const formatingPhone = (number) => {
  const digit = number.replace(/[^\d]/g, "")
  const numberLength = digit.length
  let rez = ""
  if (!numberLength) {
    rez = digit
  } else {
    if (numberLength < 4) {
      rez = digit.slice(0, 3)
    } else {
      if (numberLength < 7) {
        rez = `(${digit.slice(0, 3)}) ${digit.slice(3, 6)}`
      } else {
        if (numberLength < 9) {
          rez = `(${digit.slice(0, 3)}) ${digit.slice(3, 6)}-${digit.slice(
            6,
            8
          )}`
        } else {
          if (numberLength >= 9) {
            rez = `(${digit.slice(0, 3)}) ${digit.slice(3, 6)}-${digit.slice(
              6,
              8
            )}-${digit.slice(8, 10)}`
          }
        }
      }
    }
  }
  return rez
}

export const addRiple = (e) => {
  const circle = document.createElement("span")
  circle.classList.add("riple")
  const button = e.target
  const x = e.clientX
  const y = e.clientY
  const buttonY = e.target.offsetTop
  const buttonX = e.target.offsetLeft
  const insideX = x - buttonX
  const insideY = y - buttonY
  circle.style.top = insideY + "px"
  circle.style.left = insideX + "px"

  button.appendChild(circle)
  setTimeout(() => {
    circle.remove()
  }, 1000)
}

export const sortObjFields = (obj) =>
  Object.assign(
    {},
    ...Object.keys(obj)
      .sort()
      .map((key) => ({ [key]: obj[key] }))
  )

export const optionsToBarcods = (input = {}) => {
  // Отфильтровываем только те поля в которых есть значения
  const activeInput = Object.keys(input)
    .filter((item) => Object.keys(input[item]).length)
    .reduce((acc, item) => ({ ...acc, [item]: input[item] }), {})
  // Массив ключей
  const orderArr = Object.keys(activeInput)
  let output = {}
  // Организовываем матрешку начиная с последнего элемента
  if (orderArr.length) {
    for (let i = 1; i <= orderArr.length; i++) {
      output = {
        ...Object.keys(activeInput[orderArr[orderArr.length - i]])
          .sort()
          .map((value) => ({ [value]: i === 1 ? "" : { ...output } }))
          .reduce((acc, item) => ({ ...acc, ...item }), {}),
      }
    }
  }

  return output
}

export const copyBarcods = (existBc, newBc) => {
  const checker = (existObj, newObj) =>
    Object.keys(newObj).forEach((item) => {
      if (!existObj.hasOwnProperty(item)) return
      if (typeof newObj[item] === "object") {
        checker(existObj[item], newObj[item])
      } else {
        newObj[item] = existObj[item]
      }
    })

  checker(existBc, newBc)
  return newBc
}
