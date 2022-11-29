import { API_URL } from "../config"

const getCategoriesTree = (category, categories) => {
  var result = [`${category.name}-${category.level}`]
  const findParent = (category) => {
    const parent = categories.find((elem) => elem._id === category.parentId)
    if (parent) {
      result.push(`${parent.name}-${parent.level}`)
      findParent(parent)
    }
    return
  }
  findParent(category)

  return result.reverse().join(" ➔ ")
}
export default function testPage({ categories }) {
  return (
    <ul>
      {categories.map((category) => (
        <li key={category._id}>
          {" "}
          <p>{getCategoriesTree(category, categories)}</p>
        </li>
      ))}
    </ul>
  )
}
export async function getServerSideProps() {
  const data = await fetch(`${API_URL}/api/categories`)
  const { categories } = await data.json()
  return {
    props: {
      categories,
    },
  }
}
