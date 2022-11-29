import { API_URL } from '@/config/index'
import React from 'react'

export default function catalogPage ({catalog,catalogs}) {
  return (
    <div>catalogPage {catalog._id}</div>
  )
}

export async function getServerSideProps({ params: { id } }) {
   const res = await fetch(`${API_URL}/api/catalogs`)
   const { catalogs } = await res.json()
   const res2 = await fetch(`${API_URL}/api/catalogs/${id}`)
   const { catalog } = await res2.json()
   if (!res.ok || !res2.ok) {
     return {
       notFound: true,
     }
  }
  return {
    props: {
      catalog,catalogs
    }
  }
}
