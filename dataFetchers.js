import useSWR from "swr"
import { API_URL } from "./config"

const fetcher=(...args)=>fetch(...args).then(res=>res.json())

export  const fetchNames=()=>{
  const { data, error } = useSWR(`${API_URL}/api/products/names`, fetcher)
  return {
    data,
    isLoading: !error && !data,   
    isError: !!error
  }
}

export const fetchAllProducts = () => {
  const { data, error } = useSWR(`${API_URL}/api/products`, fetcher)
  return {
    data,
    isLoading: !error && !data,
    isError: !!error
  }
}
export const fetchShowcaseProducts = () => {
  const { data, error } = useSWR(`${API_URL}/api/products/showcase`, fetcher)
  return {
    data,
    isLoading: !error && !data,
    isError: !!error
  }
}
 
export const fetchCategories = () => {
  const { data, error } = useSWR(`${API_URL}/api/categories`, fetcher)
  return {
    data,
    isLoading: !error && !data,
    isError: error,
  }
}

export const fetchBrands = () => {
  const { data, error } = useSWR(`${API_URL}/api/brands`, fetcher)
  return {
    data,
    isLoading: !error && !data,
    isError: error,
  }
}

export const fetchProductsCategoryId = (id) => {
    const { data, error } = useSWR(`${API_URL}/api/products/category/${id}`,fetcher)
  return {
    data,
    isLoading: !error && !data,
    isError: error,
  }
}
export const useCurrencyRate = () => {   
    const { data, error } = useSWR(`${API_URL}/api/currencyrate`,fetcher)
  return {
    data,
    isLoading: !error && !data,
    isError: error,
  }
}



