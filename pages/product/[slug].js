import Layout from "@/components/Layout"

export default function productPage({slug}) {
  return (
    <Layout title={`Страница товара ${slug}`}>
      <h1>Page of product {slug}</h1>
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