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
  product,
  
}) {
  
  const { min, max } = getStringPrice(product)
  const showMin=(
    (currencyRate[product.currencyValue] * +min) /
    currencyRate[currencyShop]
  ).toFixed(2)
  const showMax=(
    (currencyRate[product.currencyValue] * +max) /
    currencyRate[currencyShop]
  ).toFixed(2)
const string=min===max?showMin:`${showMin} - ${showMax}`
  return string
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
  const priceNum =
    parseFloat(string.replace(/[^\d.,]+/g, "").replace(",", ".")) || 0

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



export const createPriceObject = ({ ownOptions, optionValues }) => {
 
  // убираем поля пустышки
  const fillingOwnOptions = Object.assign(
    {},
    ...Object.keys(ownOptions)
      .filter((item) => ownOptions[item].length)
      .map((item) => ({ [item]: ownOptions[item].sort() }))
  )

  let rez = { price: "", barcode: "" }

  Object.keys(fillingOwnOptions)
    .reverse()
    .forEach((option) => {
      rez = Object.assign(
        {},
        ...fillingOwnOptions[option].map((value) => ({
          [value]: JSON.parse(JSON.stringify(rez)),
        }))
      )
    })

  //  копируем значения полей из староно объекта values.options во вновь созданный rez
  const deep = (newOptions, oldOptions) => {
    if (newOptions.hasOwnProperty("price")) return newOptions
    Object.keys(newOptions).forEach((item) => {
      if (!oldOptions.hasOwnProperty(item)) return
      if (newOptions[item].hasOwnProperty("price")) {
        newOptions[item] = JSON.parse(JSON.stringify(oldOptions[item]))
      } else {
        deep(newOptions[item], oldOptions[item])
      }
    })
    return newOptions
  }

  return deep(rez, optionValues)
  
}

export const getStringPrice = (values) => {  
  const pricesArray = []
  const deep = (options) => {
    if (options.hasOwnProperty("price")) {
      pricesArray.push(options.price)
      return
    } else {
      Object.keys(options).forEach((item) => {
        deep(options[item])
      })
    }
  }
  // if (!Object.keys(values.optionValues).length) {
  //   return {string:'',min:0,max:0}
  // }
  deep(values.optionValues)  
  const min = pricesArray.sort((a, b) => a - b)[0]
  const max = pricesArray.sort((a, b) => b - a)[0]  
  let string =
    min === max
      ? `${min.toString()} ${getCurrencySymbol(values.currencyValue)}`
      : `${min}...${max} ${getCurrencySymbol(values.currencyValue)}`
 
  return { string, min, max }
}
