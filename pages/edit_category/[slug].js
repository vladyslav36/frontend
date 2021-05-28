import Layout from "@/components/Layout";

export default function editCategory({ slug }) {
  return (
    <Layout title={`Редактирование категории ${slug}`}>
      <h1>Редактирование категории {slug}</h1>
    </Layout>
  )
}
 
export async function getServerSideProps({ params: { slug } }) {
  return {
    props: {
      slug
    }
  }
}