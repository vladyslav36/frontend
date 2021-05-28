import Layout from "@/components/Layout";

export default function deleteCategory({slug}) {
  return (
    <Layout title={`Удаление категории ${slug}`}>
      <h1>Удаление категории {slug}</h1>
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