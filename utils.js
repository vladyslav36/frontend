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


export const bcPricesToOptions = ({ barcods, options, bcPrice }) => {
  
  // ф-я сравнения объектов по их содержимому
  const compareObj = (obj1, obj2) => {
    if (obj1 === obj2) {
      return true
    }

    if (typeof obj1 !== typeof obj2) {
      return false
    }

    if (
      typeof obj1 !== "object" ||
      typeof obj2 !== "object" ||
      obj1 === null ||
      obj2 === null
    ) {
      return obj1 === obj2
    }

    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)
    if (keys1.length !== keys2.length) {
      return false
    }

    for (let prop of keys1) {
      if (!compareObj(obj1[prop], obj2[prop])) {
        return false
      }
    }
    return true
  }



  const changeBcToPrice = (bc, bcPrice) => {
    
    const deepToBc = (bc) => Object.keys(bc).map(item => {      
      if (typeof (bc[item]) === 'string') {
        const value = bcPrice.find(item2 => item2.barcode === bc[item]).price
        bc[item]=value
      } else {
        deepToBc(bc[item])
      }
    })
    deepToBc(bc)
    
  }

  // ф-я находит изменяющуюся опцию
  const searchOption = (barcods, options) => {
    const option = []
    const levels = []
    let level = 0
    const searchLevel = (bc) => {
      const firstKey = Object.keys(bc)[0]
      const isEqual = Object.keys(bc).every((item) =>
        compareObj(bc[firstKey], bc[item])
      )
      if (!isEqual) {
        const changedOption = Object.keys(options)[level]
        if (!option.includes(changedOption)) option.push(changedOption)
        if (!levels.includes(level)) levels.push(level)
      }
      if (typeof bc[firstKey] === "string") {
        return
      }
      level++
      for (let key in bc) {
        searchLevel(bc[key])
      }
      level--
    }
    searchLevel(barcods)
    return { option, levels }
  }

  // создание объекта прайсов для изменяющегося объекта опции по первому элементу
  // т.к.предполагается что остальные опции не меняются
  const searchPrices = (bc) => {
    return Object.keys(bc)
      .map((item) => {
        if (typeof bc[item] === "string") {
          return { [item]:bc[item]}
        } else {
          const getDeepPrice = (bcObj) => {
            const firstKey = Object.keys(bcObj)[0]
            if (typeof bcObj[firstKey] === "string") {
              return bcObj[firstKey]
            } else {
              return getDeepPrice(bcObj[firstKey])
            }
          }
          const price = getDeepPrice(bc[item])
          return { [item]: price }
        }
      })
      .reduce((acc, value) => ({ ...acc, ...value }), {})
  }

  // ф-я формирует объект прайсов если известен уровень погружения измененного прайса
  const getPricesByLevel = (barcods, targetLevel) => {
    let level = 0

    const deepToBc = (bc) => {
      if (level === targetLevel) {
        return searchPrices(bc)
      } else {
        const firstKey = Object.keys(bc)[0]
        level++
        return deepToBc(bc[firstKey])
      }
    }

    return deepToBc(barcods)
  }

  changeBcToPrice(barcods, bcPrice)
 
  const changedOption = searchOption(barcods, options)
  if (changedOption.option.length > 1) {
    return { newOptions: {}, error: true }
  }

  let totalPrice = ""
  let pricesObj = {}
  // если измененных опций нет
  if (changedOption.option.length === 0) {
    totalPrice = Object.values(searchPrices(barcods))[0]
  } else {
    pricesObj = getPricesByLevel(barcods, changedOption.levels[0])
    totalPrice = Object.values(pricesObj).sort((a, b) => a - b)[0]
  }

  const newOptions = Object.assign(
    {},
    ...Object.keys(options).map((option) => ({
      [option]: Object.assign(
        {},
        ...Object.keys(options[option]).map((value) => {
          if (
            changedOption.option.length != 0 &&
            option === changedOption.option[0]
          ) {
            return totalPrice === pricesObj[value]
              ? { [value]: { price: pricesObj[value], isChanged: false } }
              : { [value]: { price: pricesObj[value], isChanged: true } }
          } else {
            return { [value]: { price: totalPrice, isChanged: false } }
          }
        })
      ),
    }))
  )
  return { newOptions, error: false,totalPrice,changedOption:changedOption.option[0] }
}

 export const createPriceObject = (ownOptions) => {
   // убираем поля пустышки
   const fillingOwnOptions = Object.assign(
     {},
     ...Object.keys(ownOptions)
       .filter((item) => ownOptions[item].length)
       .map((item) => ({ [item]: ownOptions[item] }))
   )

   let rez = { price: "", barcode: "" }

   Object.keys(fillingOwnOptions)
     .reverse()
     .forEach((option) => {
       rez = Object.assign(
         {},
         ...ownOptions[option].map((value) => ({
           [value]: JSON.parse(JSON.stringify(rez)),
         }))
       )
     })
   return rez
 }