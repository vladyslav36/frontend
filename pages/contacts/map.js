import Layout from '@/components/Layout'

export default function MapPage() {
  return (
    <Layout title="Мы на карте">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2564.374422644064!2d36.30457775165689!3d50.00433697931523!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4127a73fe250986b%3A0x435ec5d2c40c63da!2z0J7Qv9GC0L7QstGL0Lkg0LzQsNCz0LDQt9C40L0gItCa0LDRgNC80LXQvSI!5e0!3m2!1sru!2sua!4v1620472229174!5m2!1sru!2sua"
        width="960"
        height="600"
        styleName="border:0;"
        allowfullscreen=""
        loading="lazy"
      ></iframe>
    </Layout>
  )
}
