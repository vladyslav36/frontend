export function getCurrencySymbol(currencyValue) {
  switch (currencyValue) {
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
      return "UAH"
  }
}

export function getPriceForShow({
  currencyShop,
  currencyRate,
  currencyValue,
  price,
}) {
  const showPrice = (
    (currencyRate[currencyValue] * price) /
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

export const getSearchItemsList = (items, searchString,limit) => {  
    const list = items.filter(
      ({ name }) => name.toLowerCase().indexOf(searchString.toLowerCase()) >= 0
  ).map(item=>item.name).slice(0,limit)  
    return list
  }

